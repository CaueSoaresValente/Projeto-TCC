import { AppDataSource } from '../../config/data-source.js';
import { Disciplina } from './disciplina.entity.js';

export class DisciplinaRepository {
  private repo = AppDataSource.getRepository(Disciplina);

  async findAll(): Promise<Disciplina[]> {
    return await this.repo.find();
  }
}
