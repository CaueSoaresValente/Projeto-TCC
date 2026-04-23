import { Request, Response } from 'express';
import { CadastroService } from './cadastro.service.js';

export class CadastroController {
  private service = new CadastroService();

  async create(req: Request, res: Response) {
    try {
      const result = await this.service.create(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const result = await this.service.findById(Number(req.params.id));
      if (!result) return res.status(404).json({ message: 'Cadastro não encontrado' });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Adicionar outros métodos conforme necessário
}
