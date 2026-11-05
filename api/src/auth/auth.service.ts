import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';

// Comparar com um hash qualquer quando o e-mail não existe evita revelar,
// pelo tempo de resposta, quais e-mails estão cadastrados
const HASH_FALSO = bcrypt.hashSync('usuario-inexistente', 10);

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    const ok = await bcrypt.compare(senha, usuario?.senhaHash ?? HASH_FALSO);
    if (!usuario || !ok)
      throw new UnauthorizedException('E-mail ou senha inválidos');

    const token = await this.jwt.signAsync({
      sub: usuario.id,
      email: usuario.email,
    });
    return {
      token,
      usuario: { id: usuario.id, email: usuario.email, nome: usuario.nome },
    };
  }
}
