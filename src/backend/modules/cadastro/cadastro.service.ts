import { CadastroRepository } from './cadastro.repository.js';
import { Cadastro } from './cadastro.entity.js';

export class CadastroService {
  private repo = new CadastroRepository();

  async create(data: Partial<Cadastro>) {
    // Adicionar lógica de negócio aqui (ex: validar e hashear senha se presente no repo)
    return await this.repo.create(data);
  }

  async findById(id: number) {
    return await this.repo.findById(id);
  }

  // Adicionar outros métodos conforme necessário
}
