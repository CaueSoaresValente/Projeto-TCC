import { DisponibilidadeRepository } from './disponibilidade.repository.js';

export class DisponibilidadeService {
  private repo = new DisponibilidadeRepository();

  async findByProfessorId(professorId: number) {
    return await this.repo.findByProfessorId(professorId);
  }
}
