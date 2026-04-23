// src/backend/modules/cadastro/cadastro.repository.ts
import { AppDataSource } from "../../config/data-source.js";
import { Cadastro } from "./cadastro.entity.js";
import * as bcrypt from "bcryptjs";

export class CadastroRepository {
  private repo = AppDataSource.getRepository(Cadastro);

  // ====================== CRUD ======================
  async create(data: Partial<Cadastro>): Promise<Cadastro> {
    const cadastro = this.repo.create(data);
    return await this.repo.save(cadastro);
  }

  async findByEmail(email: string): Promise<Cadastro | null> {
    return await this.repo
        .createQueryBuilder("cadastro")
        .addSelect("cadastro.senha")
        .where("cadastro.email = :email", { email })
        .getOne();
    }

  async findById(id: number): Promise<Cadastro | null> {
    return await this.repo.findOne({ where: { idUsuario: id } });
  }

  async update(id: number, data: Partial<Cadastro>): Promise<Cadastro | null> {
    await this.repo.update(id, data);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  // ====================== SENHA (RNF005 + RN002) ======================
  async hashPassword(senha: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(senha, salt);
  }

  async comparePassword(senhaDigitada: string, senhaHash: string): Promise<boolean> {
    if (!senhaHash) {
        throw new Error("Senha não carregada do banco");
    }

    return await bcrypt.compare(senhaDigitada, senhaHash);
   }

  // Validação de força de senha (RN002)
  validatePasswordStrength(senha: string): { valid: boolean; message?: string } {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!regex.test(senha)) {
      return {
        valid: false,
        message: "Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial (!@#$%^&*)",
      };
    }
    return { valid: true };
  }
}
