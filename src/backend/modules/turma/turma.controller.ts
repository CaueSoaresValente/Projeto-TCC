import { Request, Response } from 'express';
import { TurmaService } from './turma.service.js';

export class TurmaController {
  private service = new TurmaService();

  async findAll(req: Request, res: Response) {
    try {
      const result = await this.service.findAll();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
