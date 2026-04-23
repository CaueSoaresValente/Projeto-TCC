// src/backend/config/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { Cadastro } from "../modules/cadastro/cadastro.entity.js";
import { Gestor } from "../modules/gestor/gestor.entity.js";
import { OPP } from "../modules/opp/opp.entity.js";
import { Professor } from "../modules/professor/professor.entity.js";
import { Disciplina } from "../modules/disciplina/disciplina.entity.js";
import { ProfessorDisciplina } from "../modules/disciplina/professor-disciplina.entity.js";
import { ProfessorTurma } from "../modules/turma/professor-turma.entity.js";
import { Turma } from "../modules/turma/turma.entity.js";
import { Disponibilidade } from "../modules/disponibilidade/disponibilidade.entity.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",                    // ← Mudado para MySQL
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,

  synchronize: false,
  logging: process.env.NODE_ENV === "development",

  entities: [
    Cadastro,
    Gestor,
    OPP,
    Professor,
    Disciplina,
    ProfessorDisciplina,
    ProfessorTurma,
    Turma,
    Disponibilidade,
  ],

  migrations: ["src/backend/database/migrations/*.ts"],
  subscribers: [],
});
