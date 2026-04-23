// src/backend/modules/disciplina/professor-disciplina.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Professor } from '../professor/professor.entity.js';
import { Disciplina } from './disciplina.entity.js';

@Entity('professor_disciplina')
@Unique(['idDisciplina', 'idProfessor']) // garante 1 nível por professor/disciplina
export class ProfessorDisciplina {
  @PrimaryGeneratedColumn({ name: 'id_professordisciplina' })
  idProfessorDisciplina: number;

  @Column({ name: 'id_disciplina', type: 'int', unique: true })
  idDisciplina: number;

  @Column({ name: 'id_professor', type: 'int', unique: true })
  idProfessor: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 }) // ex: 80.00 (porcentagem 0-100)
  nivelCompetencia: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => Disciplina, (disciplina) => disciplina.professorDisciplinas, { nullable: false })
  @JoinColumn({ name: 'id_disciplina' })
  disciplina: Disciplina;

  @ManyToOne(() => Professor, (professor) => professor.professorDisciplinas, { nullable: false })
  @JoinColumn({ name: 'id_professor' })
  professor: Professor;
}
