import { OPPRepository } from './opp.repository.js';

export class OPPService {
  private repo = new OPPRepository();

  async findById(id: number) {
    return await this.repo.findById(id);
  }
}
