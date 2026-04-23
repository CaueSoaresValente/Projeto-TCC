// src/backend/modules/disciplina/disciplina.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProfessorDisciplina } from './professor-disciplina.entity.js';
import { Turma } from '../turma/turma.entity.js';

@Entity('disciplina')
export class Disciplina {
  @PrimaryGeneratedColumn({ name: 'id_disciplina' })
  idDisciplina: number;

  @Column({ type: 'varchar', length: 100 })
  nome: string; // ex: "Back-End", "Power BI básico"

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @OneToMany(() => ProfessorDisciplina, (pd) => pd.disciplina)
  professorDisciplinas: ProfessorDisciplina[];

  @OneToMany(() => Turma, (turma) => turma.disciplina)
  turmas: Turma[];
}
