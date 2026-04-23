import { AppDataSource } from '../../config/data-source.js';
import { Professor } from './professor.entity.js';

export class ProfessorRepository {
  private repo = AppDataSource.getRepository(Professor);

  async findById(id: number): Promise<Professor | null> {
    return await this.repo.findOne({ where: { idProfessor: id } });
  }
}
