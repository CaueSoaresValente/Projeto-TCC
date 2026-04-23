import { AppDataSource } from '../../config/data-source.js';
import { Turma } from './turma.entity.js';

export class TurmaRepository {
  private repo = AppDataSource.getRepository(Turma);

  async findAll(): Promise<Turma[]> {
    return await this.repo.find({ relations: ['gestor', 'opp', 'disciplina'] });
  }
}
