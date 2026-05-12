import { CadastroRepository } from './cadastro.repository.js';
import { Cadastro } from './cadastro.entity.js';

export class CadastroService {
  private repo = new CadastroRepository();

  async create(data: Partial<Cadastro>) {
    if (data.senha) {
      data.senha = await this.repo.hashPassword(data.senha);
    }
    return await this.repo.create(data);
  }

  async findById(id: number) {
    return await this.repo.findById(id);
  }
}
