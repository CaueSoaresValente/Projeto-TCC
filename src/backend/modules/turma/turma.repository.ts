import { AppDataSource } from '../../config/data-source.js';
import { Turma } from './turma.entity.js';
import { TurmaUC } from './turma-uc.entity.js';

const RELATIONS = [
  'criador',
  'opp',
  'opp.cadastro',
  'turmaUCs',
  'turmaUCs.unidadeCurricular',
  'turmaUCs.unidadeCurricular.area',
  'professorTurmas',
  'professorTurmas.professor',
  'professorTurmas.professor.cadastro',
] as const;

export class TurmaRepository {
  private repo = AppDataSource.getRepository(Turma);
  private turmaUCRepo = AppDataSource.getRepository(TurmaUC);

  async findAll(): Promise<Turma[]> {
    return this.repo.find({
      where: { status: true },
      relations: [...RELATIONS],
      order: { idTurma: 'DESC' },
    });
  }

  async findByOPP(idOPP: number): Promise<Turma[]> {
    return this.repo.find({
      where: { status: true, idOPP },
      relations: [...RELATIONS],
      order: { idTurma: 'DESC' },
    });
  }

  async findById(idTurma: number): Promise<Turma | null> {
    return this.repo.findOne({
      where: { idTurma, status: true },
      relations: [...RELATIONS],
    });
  }

  async create(data: Partial<Turma>): Promise<Turma> {
    const turma = this.repo.create(data);
    return this.repo.save(turma);
  }

  async saveHorarios(
    idTurma: number,
    horarios: { idUC: number; diaSemana: string; periodo: string }[],
  ): Promise<void> {
    await this.turmaUCRepo.delete({ idTurma });
    if (horarios.length === 0) return;

    const registros = horarios.map((h) =>
      this.turmaUCRepo.create({
        idTurma,
        idUC: h.idUC,
        diaSemana: h.diaSemana,
        periodo: h.periodo,
      }),
    );
    await this.turmaUCRepo.save(registros);
  }

  async update(idTurma: number, data: Partial<Turma>): Promise<Turma | null> {
    await this.repo.update({ idTurma }, data);
    return this.findById(idTurma);
  }

  async softDelete(idTurma: number): Promise<void> {
    await this.repo.update({ idTurma }, { status: false });
  }
}
