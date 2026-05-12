import { Request, Response } from 'express';
import { UnidadeCurricularService } from './unidade-curricular.service.js';

export class UnidadeCurricularController {
  private service = new UnidadeCurricularService();

  async list(req: Request, res: Response) {
    try {
      const ucs = await this.service.findAll();
      return res.json(ucs);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
