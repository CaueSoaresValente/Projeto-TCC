import { Request, Response } from 'express';
import { DisponibilidadeService } from './disponibilidade.service.js';

export class DisponibilidadeController {
  private service = new DisponibilidadeService();

  async findByProfessor(req: Request, res: Response) {
    try {
      const result = await this.service.findByProfessorId(Number(req.params.professorId));
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
