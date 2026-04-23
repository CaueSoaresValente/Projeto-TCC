// src/backend/modules/gestor/gestor.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cadastro } from '../cadastro/cadastro.entity.js';
import { OPP } from '../opp/opp.entity.js';
import { Turma } from '../turma/turma.entity.js';

@Entity('gestor')
export class Gestor {
  @PrimaryGeneratedColumn({ name: 'id_gestor' })
  idGestor: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'id_cadastro', type: 'int' })
  idCadastro: number;

  @Column({ type: 'varchar', length: 100 })
  setor: string; // ex: "Tecnologia", "Ferrovia", etc.

  @ManyToOne(() => Cadastro, (cadastro) => cadastro.gestor, { nullable: false })
  @JoinColumn({ name: 'id_cadastro' })
  cadastro: Cadastro;

  @OneToMany(() => OPP, (opp) => opp.gestor)
  opps: OPP[];

  @OneToMany(() => Turma, (turma) => turma.gestor)
  turmas: Turma[];
}
