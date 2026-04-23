import { ProfessorRepository } from './professor.repository.js';

export class ProfessorService {
  private repo = new ProfessorRepository();

  async findById(id: number) {
    return await this.repo.findById(id);
  }
}
