import { In } from 'typeorm';
import { AppDataSource } from '../../config/data-source.js';
import { OPP } from '../opp/opp.entity.js';
import { UnidadeCurricular } from '../disciplina/unidade-curricular.entity.js';
import { Turma } from './turma.entity.js';
import { TurmaRepository } from './turma.repository.js';
import { ProfessorUC } from '../disciplina/professor-uc.entity.js';
import { ProfessorTurma } from './professor-turma.entity.js';

const MAPA_DIA_CURTO: Record<string, string> = {
  segunda: 'Seg',
  terca: 'Ter',
  quarta: 'Qua',
  quinta: 'Qui',
  sexta: 'Sex',
  sabado: 'Sáb',
};

const MODALIDADE_LABELS: Record<string, string> = {
  tec: 'Técnico',
  cai: 'Aprendizagem Industrial (CAI)',
  fic: 'Formação Inicial e Continuada (FIC)',
};

interface UsuarioToken {
  idUsuario: number;
  funcao: string;
}

interface ListarFiltros {
  search?: string;
  periodo?: string;
}

interface HorarioInput {
  diaSemana: string;
  periodo: string;
  idUC?: number;
  nomeUC?: string;
}

interface CriarTurmaInput {
  nome: string;
  tipoCurso: string;
  dataInicio: string;
  dataTermino: string;
  idOPP: number;
  idArea?: number;
  aulasSemana?: number;
  totalAulas?: number;
  horarios: HorarioInput[];
}

export class TurmaService {
  private repo = new TurmaRepository();

  async listar(usuario: UsuarioToken, filtros: ListarFiltros = {}) {
    let turmas: Turma[];

    if (usuario.funcao === 'opp') {
      const idOPP = await this.resolverIdOPP(usuario.idUsuario);
      if (!idOPP) {
        throw new Error('OPP não encontrado para este cadastro');
      }
      turmas = await this.repo.findByOPP(idOPP);
    } else {
      turmas = await this.repo.findAll();
    }

    const cards = turmas.map((t) => this.mapTurmaParaCard(t));

    return cards.filter((card) => {
      const matchPeriodo = this.cardMatchesPeriodo(card, filtros.periodo || 'Todas');
      const matchSearch = this.cardMatchesSearch(card, filtros.search || '');
      return matchPeriodo && matchSearch;
    });
  }

  async criar(usuario: UsuarioToken, dados: CriarTurmaInput) {
    if (!dados.nome?.trim()) {
      throw new Error('Nome da turma é obrigatório');
    }
    if (!dados.dataInicio || !dados.dataTermino) {
      throw new Error('Datas de início e término são obrigatórias');
    }
    if (!dados.horarios?.length) {
      throw new Error('Informe ao menos um horário na grade');
    }

    let idOPP = dados.idOPP;

    if (usuario.funcao === 'opp') {
      const oppId = await this.resolverIdOPP(usuario.idUsuario);
      if (!oppId) throw new Error('OPP não encontrado para este cadastro');
      idOPP = oppId;
    } else if (!idOPP) {
      throw new Error('OPP responsável é obrigatório');
    }

    const horariosResolvidos = await this.resolverHorarios(dados.horarios, dados.idArea);

    const turma = await this.repo.create({
      idCriador: usuario.idUsuario,
      idOPP,
      nome: dados.nome.trim(),
      tipoCurso: dados.tipoCurso.toUpperCase(),
      dataInicio: new Date(dados.dataInicio),
      dataTermino: new Date(dados.dataTermino),
      aulasSemana: dados.aulasSemana ?? this.contarDiasUnicos(horariosResolvidos),
      totalAulas: dados.totalAulas ?? horariosResolvidos.length,
      status: true,
    });

    await this.repo.saveHorarios(turma.idTurma, horariosResolvidos);

    const salva = await this.repo.findById(turma.idTurma);
    return this.mapTurmaParaCard(salva!);
  }

  async atualizar(idTurma: number, usuario: UsuarioToken, dados: Partial<CriarTurmaInput>) {
    const turma = await this.repo.findById(idTurma);
    if (!turma) return null;

    await this.verificarPermissao(usuario, turma);

    const updateData: Partial<Turma> = {};
    if (dados.nome) updateData.nome = dados.nome.trim();
    if (dados.tipoCurso) updateData.tipoCurso = dados.tipoCurso.toUpperCase();
    if (dados.dataInicio) updateData.dataInicio = new Date(dados.dataInicio);
    if (dados.dataTermino) updateData.dataTermino = new Date(dados.dataTermino);
    if (dados.idOPP && usuario.funcao === 'gestor') updateData.idOPP = dados.idOPP;

    // Se mudou data ou horários, recalculamos aulasSemana e totalAulas
    const dataInicioFinal = dados.dataInicio ? new Date(dados.dataInicio) : turma.dataInicio;
    const dataTerminoFinal = dados.dataTermino ? new Date(dados.dataTermino) : turma.dataTermino;

    let horariosResolvidos: { idUC: number; diaSemana: string; periodo: string }[] = [];
    const horariosForamPassados = dados.horarios !== undefined;

    if (horariosForamPassados) {
      horariosResolvidos = await this.resolverHorarios(dados.horarios || [], dados.idArea);
      
      // Regra de negócio: remover professores vinculados a UCs deletadas dos horários da turma
      const oldUCs = turma.turmaUCs || [];
      const oldUCIds = [...new Set(oldUCs.map(h => h.idUC))];
      const newUCIds = [...new Set(horariosResolvidos.map(h => h.idUC))];
      const deletedUCIds = oldUCIds.filter(id => !newUCIds.includes(id));

      if (deletedUCIds.length > 0) {
        // Encontrar os professores que estão vinculados a essas UCs
        const profUCRepo = AppDataSource.getRepository(ProfessorUC);
        const profsComUCsDeletadas = await profUCRepo.find({
          where: { idUC: In(deletedUCIds) }
        });
        const idsProfessoresRemover = [...new Set(profsComUCsDeletadas.map(p => p.idProfessor))];

        if (idsProfessoresRemover.length > 0) {
          // Remover os professores da turma (professor_turma)
          const profTurmaRepo = AppDataSource.getRepository(ProfessorTurma);
          await profTurmaRepo.delete({
            idTurma,
            idProfessor: In(idsProfessoresRemover)
          });
        }
      }

      await this.repo.saveHorarios(idTurma, horariosResolvidos);
    }

    const horariosFinais = horariosForamPassados ? horariosResolvidos : (turma.turmaUCs || []);
    updateData.aulasSemana = this.contarDiasUnicos(horariosFinais);
    updateData.totalAulas = this.calcularTotalAulas(dataInicioFinal, dataTerminoFinal, horariosFinais);

    await this.repo.update(idTurma, updateData);

    const atualizada = await this.repo.findById(idTurma);
    return atualizada ? this.mapTurmaParaCard(atualizada) : null;
  }

  async excluir(idTurma: number, usuario: UsuarioToken) {
    const turma = await this.repo.findById(idTurma);
    if (!turma) return false;

    await this.verificarPermissao(usuario, turma);
    await this.repo.softDelete(idTurma);
    return true;
  }

  private async verificarPermissao(usuario: UsuarioToken, turma: Turma) {
    if (usuario.funcao === 'gestor') return;

    if (usuario.funcao === 'opp') {
      const idOPP = await this.resolverIdOPP(usuario.idUsuario);
      if (idOPP !== turma.idOPP) {
        throw new Error('Você não tem permissão para alterar esta turma');
      }
      return;
    }

    throw new Error('Acesso negado');
  }

  private async resolverIdOPP(idCadastro: number): Promise<number | null> {
    const oppRepo = AppDataSource.getRepository(OPP);
    const opp = await oppRepo.findOne({ where: { idCadastro } });
    return opp?.idOPP ?? null;
  }

  private async resolverHorarios(horarios: HorarioInput[], idArea?: number) {
    const ucRepo = AppDataSource.getRepository(UnidadeCurricular);
    const resolvidos: { idUC: number; diaSemana: string; periodo: string }[] = [];

    for (const h of horarios) {
      let idUC = h.idUC;

      if (!idUC && h.nomeUC) {
        const where: Record<string, unknown> = { nome: h.nomeUC };
        if (idArea) where.idArea = idArea;

        const uc = await ucRepo.findOne({ where: where as any });
        if (!uc) {
          throw new Error(`Unidade curricular "${h.nomeUC}" não encontrada`);
        }
        idUC = uc.idUC;
      }

      if (!idUC) {
        throw new Error('Cada horário precisa de idUC ou nomeUC');
      }

      resolvidos.push({
        idUC,
        diaSemana: h.diaSemana.toLowerCase(),
        periodo: h.periodo,
      });
    }

    return resolvidos;
  }

  private contarDiasUnicos(
    horarios: { diaSemana: string }[],
  ): number {
    return new Set(horarios.map((h) => h.diaSemana)).size;
  }

  private mapTurmaParaCard(turma: Turma) {
    const grade = this.buildGrade(turma);
    const areas = [
      ...new Set(
        turma.turmaUCs
          ?.map((tuc) => tuc.unidadeCurricular?.area?.nome)
          .filter(Boolean) as string[],
      ),
    ];

    const professores =
      turma.professorTurmas
        ?.filter((pt) => pt.status)
        .map((pt) => ({
          nome: pt.professor?.cadastro?.nome || 'Sem nome',
          foto:
            pt.professor?.cadastro?.fotoPerfil ||
            'https://img.freepik.com/fotos-gratis/professor-senior-olhando-camera-contra-chalkboard-com-matematica-exemplo_23-2148200995.jpg?semt=ais_hybrid&w=740&q=80',
        })) || [];

    const inicio = turma.dataInicio ? new Date(turma.dataInicio) : null;
    const termino = turma.dataTermino ? new Date(turma.dataTermino) : null;

    let duracaoDias = 0;
    if (inicio && termino) {
      duracaoDias =
        Math.ceil((termino.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }

    const siglas = grade[0]?.periodo || 'N/D';

    return {
      idTurma: turma.idTurma,
      label: turma.nome,
      value: `turma-${turma.idTurma}`,
      modalidade: turma.tipoCurso.toLowerCase(),
      siglas,
      areas,
      grade,
      aulasSemana: turma.aulasSemana ?? this.contarDiasUnicos(turma.turmaUCs || []),
      totalAulas: turma.totalAulas ?? turma.turmaUCs?.length ?? 0,
      duracaoDias,
      dataInicio: inicio ? this.formatarData(inicio) : '',
      dataTermino: termino ? this.formatarData(termino) : '',
      dataInicioISO: inicio?.toISOString().split('T')[0] || '',
      dataTerminoISO: termino?.toISOString().split('T')[0] || '',
      criadorNome: turma.criador?.nome || '',
      oppNome: turma.opp?.cadastro?.nome || '',
      professores,
    };
  }

  private buildGrade(turma: Turma) {
    const periodos: Record<string, { aulas: Record<string, { disciplina: string; professor: string }> }> =
      {};

    const profPadrao =
      turma.professorTurmas?.[0]?.professor?.cadastro?.nome || 'A definir';

    for (const tuc of turma.turmaUCs || []) {
      const per = tuc.periodo;
      if (!periodos[per]) {
        periodos[per] = { aulas: {} };
      }
      const targetPeriodo = periodos[per];
      if (targetPeriodo) {
        const dia = MAPA_DIA_CURTO[tuc.diaSemana.toLowerCase()] || tuc.diaSemana;
        targetPeriodo.aulas[dia] = {
          disciplina: tuc.unidadeCurricular?.nome || '',
          professor: profPadrao,
        };
      }
    }

    return Object.entries(periodos).map(([periodo, data]) => ({
      periodo,
      aulas: data.aulas,
    }));
  }

  private formatarData(data: Date): string {
    const d = data.getDate().toString().padStart(2, '0');
    const m = (data.getMonth() + 1).toString().padStart(2, '0');
    const y = data.getFullYear();
    return `${d}/${m}/${y}`;
  }

  private cardMatchesPeriodo(
    card: { siglas: string; grade: { periodo: string }[] },
    filtro: string,
  ): boolean {
    if (!filtro || filtro === 'Todas') return true;

    const periodos = card.grade?.length
      ? card.grade.map((g) => g.periodo)
      : [card.siglas];

    return periodos.some((p) => this.periodoMatchesFiltro(p, filtro));
  }

  private periodoMatchesFiltro(periodo: string, filtro: string): boolean {
    const p = periodo.toUpperCase();

    switch (filtro) {
      case 'Manhã':
        return (
          p.startsWith('M') ||
          p === 'MANHÃ' ||
          p.includes('INT_M') ||
          p === 'INT_MT' ||
          p === 'INT_MN'
        );
      case 'Tarde':
        return (
          (p.startsWith('T') && !p.startsWith('INT_TN')) ||
          p === 'TARDE' ||
          p === 'INT_MT' ||
          p === 'INT_TN'
        );
      case 'Noite':
        return p.startsWith('N') || p === 'NOITE' || p === 'INT_MN' || p === 'INT_TN';
      case 'Integral':
        return p === 'INT' || p === 'INTEGRAL' || p.startsWith('INT_');
      default:
        return true;
    }
  }

  private calcularTotalAulas(dataInicio: Date, dataTermino: Date, horarios: { diaSemana: string }[]): number {
    if (!dataInicio || !dataTermino || !horarios.length) return 0;
    if (dataInicio > dataTermino) return 0;

    const mapaDiasJs: Record<string, number> = {
      segunda: 1,
      terca: 2,
      quarta: 3,
      quinta: 4,
      sexta: 5,
      sabado: 6
    };

    const diasSelecionadosJs = [
      ...new Set(
        horarios.map(h => mapaDiasJs[h.diaSemana.toLowerCase()]).filter(d => d !== undefined)
      )
    ];

    let total = 0;
    const current = new Date(dataInicio);
    current.setHours(12, 0, 0, 0);
    const end = new Date(dataTermino);
    end.setHours(12, 0, 0, 0);

    while (current <= end) {
      if (diasSelecionadosJs.includes(current.getDay())) {
        total++;
      }
      current.setDate(current.getDate() + 1);
    }

    return total;
  }

  private cardMatchesSearch(
    card: {
      label: string;
      siglas: string;
      modalidade: string;
      areas: string[];
    },
    termo: string,
  ): boolean {
    const search = termo.trim().toLowerCase();
    if (!search) return true;

    if (card.label.toLowerCase().includes(search)) return true;
    if (card.siglas.toLowerCase().includes(search)) return true;
    if (card.modalidade.toLowerCase().includes(search)) return true;

    const modLabel = MODALIDADE_LABELS[card.modalidade] || '';
    if (modLabel.toLowerCase().includes(search)) return true;

    return card.areas.some((a) => a.toLowerCase().includes(search));
  }
}
