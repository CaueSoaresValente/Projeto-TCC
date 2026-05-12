// src/backend/modules/disponibilidade/disponibilidade.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Professor } from '../professor/professor.entity.js';

@Entity('disponibilidade')
@Unique(['idProfessor', 'diaSemana'])
export class Disponibilidade {
  @PrimaryGeneratedColumn({ name: 'id_disponibilidade' })
  idDisponibilidade: number;

  @Column({ name: 'dia_semana', type: 'varchar', length: 20 })
  diaSemana: string;

  @Column({ type: 'varchar', length: 20 })
  periodo: string; // "Manhã", "Tarde", "Noite"

  @Column({ name: 'id_professor', type: 'int' })
  idProfessor: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => Professor, (professor) => professor.disponibilidades, { nullable: false })
  @JoinColumn({ name: 'id_professor' })
  professor: Professor;
}
