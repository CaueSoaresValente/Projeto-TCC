import { Request, Response } from 'express';
import { DisciplinaService } from './disciplina.service.js';

export class DisciplinaController {
  private service = new DisciplinaService();

  async findAll(req: Request, res: Response) {
    try {
      const result = await this.service.findAll();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
