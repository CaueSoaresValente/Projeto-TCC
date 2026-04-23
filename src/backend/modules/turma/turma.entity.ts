// src/backend/modules/turma/turma.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Gestor } from '../gestor/gestor.entity.js';
import { OPP } from '../opp/opp.entity.js';
import { Disciplina } from '../disciplina/disciplina.entity.js';
import { ProfessorTurma } from './professor-turma.entity.js';

@Entity('turma')
export class Turma {
  @PrimaryGeneratedColumn({ name: 'id_turma' })
  idTurma: number;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ name: 'id_gestor', type: 'int' })
  idGestor: number;

  @Column({ name: 'id_opp', type: 'int' })
  idOPP: number;

  @Column({ name: 'id_disciplina', type: 'int' })
  idDisciplina: number;

  @Column({ type: 'date', name: 'data_inicio' })
  dataInicio: Date;

  @Column({ type: 'date', name: 'data_termino' })
  dataTermino: Date;

  @Column({ type: 'varchar', length: 20 })
  periodo: string; // "Manhã", "Tarde", "Noite"

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => Gestor, (gestor) => gestor.turmas, { nullable: false })
  @JoinColumn({ name: 'id_gestor' })
  gestor: Gestor;

  @ManyToOne(() => OPP, (opp) => opp.turmas, { nullable: false })
  @JoinColumn({ name: 'id_opp' })
  opp: OPP;

  @ManyToOne(() => Disciplina, (disciplina) => disciplina.turmas, { nullable: false })
  @JoinColumn({ name: 'id_disciplina' })
  disciplina: Disciplina;

  // Designação (1:1 com ProfessorTurma)
  @OneToOne(() => ProfessorTurma, (pt) => pt.turma, { nullable: true })
  professorTurma?: ProfessorTurma;
}
