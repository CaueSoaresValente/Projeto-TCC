import { TurmaRepository } from './turma.repository.js';

export class TurmaService {
  private repo = new TurmaRepository();

  async findAll() {
    return await this.repo.findAll();
  }
}
