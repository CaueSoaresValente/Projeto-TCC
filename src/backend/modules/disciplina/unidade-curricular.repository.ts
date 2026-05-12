import { AppDataSource } from '../../config/data-source.js';
import { UnidadeCurricular } from './unidade-curricular.entity.js';

export class UnidadeCurricularRepository {
  private repo = AppDataSource.getRepository(UnidadeCurricular);

  async findAll(): Promise<UnidadeCurricular[]> {
    return await this.repo.find({ relations: ['area'] });
  }
}
