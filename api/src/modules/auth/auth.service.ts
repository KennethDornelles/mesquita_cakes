import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth-response.dto';
import { User } from '../user/entities/user.entity';
import { JwtPayload } from '../../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    // Verificar se o usuário já existe
    const existingUser = await this.userService.findByEmail(
      registerInput.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Criar novo usuário
    const user = await this.userService.create(registerInput);

    // Gerar token JWT
    const token = this.generateToken(user);

    return {
      access_token: token,
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    // Buscar usuário por email
    const user = await this.userService.findByEmail(loginInput.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validar senha
    const isPasswordValid = await this.userService.validatePassword(
      user,
      loginInput.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Gerar token JWT
    const token = this.generateToken(user);

    return {
      access_token: token,
      user,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);

    if (user && (await this.userService.validatePassword(user, password))) {
      return user;
    }

    return null;
  }

  refreshToken(user: User): AuthResponse {
    const token = this.generateToken(user);

    return {
      access_token: token,
      user,
    };
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
