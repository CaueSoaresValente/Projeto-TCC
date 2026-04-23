import { DisciplinaRepository } from './disciplina.repository.js';

export class DisciplinaService {
  private repo = new DisciplinaRepository();

  async findAll() {
    return await this.repo.findAll();
  }
}
