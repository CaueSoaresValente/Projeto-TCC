import { UnidadeCurricularRepository } from './unidade-curricular.repository.js';

export class UnidadeCurricularService {
  private repo = new UnidadeCurricularRepository();

  async findAll() {
    return await this.repo.findAll();
  }
}
