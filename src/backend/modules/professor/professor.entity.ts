// src/backend/modules/professor/professor.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cadastro } from '../cadastro/cadastro.entity.js';
import { OPP } from '../opp/opp.entity.js';
import { ProfessorDisciplina } from '../disciplina/professor-disciplina.entity.js';
import { ProfessorTurma } from '../turma/professor-turma.entity.js';
import { Disponibilidade } from '../disponibilidade/disponibilidade.entity.js';

@Entity('professor')
export class Professor {
  @PrimaryGeneratedColumn({ name: 'id_professor' })
  idProfessor: number;

  @Column({ name: 'id_opp', type: 'int' })
  idOPP: number;

  @Column({ name: 'id_cadastro', type: 'int' })
  idCadastro: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => OPP, (opp) => opp.professors, { nullable: false })
  @JoinColumn({ name: 'id_opp' })
  opp: OPP;

  @ManyToOne(() => Cadastro, (cadastro) => cadastro.professor, { nullable: false })
  @JoinColumn({ name: 'id_cadastro' })
  cadastro: Cadastro;

  // === RELAÇÕES PARA O "MATCH" DE COMPETÊNCIAS E DISPONIBILIDADE ===
  @OneToMany(() => ProfessorDisciplina, (pd) => pd.professor)
  professorDisciplinas: ProfessorDisciplina[];

  @OneToMany(() => ProfessorTurma, (pt) => pt.professor)
  professorTurmas: ProfessorTurma[];

  @OneToMany(() => Disponibilidade, (d) => d.professor)
  disponibilidades: Disponibilidade[];
}
