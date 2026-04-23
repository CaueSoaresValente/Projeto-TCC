import { Request, Response } from 'express';
import { ProfessorService } from './professor.service.js';

export class ProfessorController {
  private service = new ProfessorService();

  async findById(req: Request, res: Response) {
    try {
      const result = await this.service.findById(Number(req.params.id));
      if (!result) return res.status(404).json({ message: 'Professor não encontrado' });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
