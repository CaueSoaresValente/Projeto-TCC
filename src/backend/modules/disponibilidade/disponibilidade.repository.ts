import { AppDataSource } from '../../config/data-source.js';
import { Disponibilidade } from './disponibilidade.entity.js';

export class DisponibilidadeRepository {
  private repo = AppDataSource.getRepository(Disponibilidade);

  async findByProfessorId(professorId: number): Promise<Disponibilidade[]> {
    return await this.repo.find({ where: { idProfessor: professorId } });
  }
}
