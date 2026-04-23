// src/backend/modules/turma/professor-turma.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Professor } from '../professor/professor.entity.js';
import { Turma } from './turma.entity.js';

@Entity('professor_turma')
@Unique(['idTurma', 'idProfessor']) // 1 professor por turma (designação única)
export class ProfessorTurma {
  @PrimaryGeneratedColumn({ name: 'id_professorturma' })
  idProfessorTurma: number;

  @Column({ name: 'id_turma', type: 'int', unique: true })
  idTurma: number;

  @Column({ name: 'id_professor', type: 'int', unique: true })
  idProfessor: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => Turma, (turma) => turma.professorTurma, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_turma' })
  turma: Turma;

  @ManyToOne(() => Professor, (professor) => professor.professorTurmas, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_professor' })
  professor: Professor;
}
