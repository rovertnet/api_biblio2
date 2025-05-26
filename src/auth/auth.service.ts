// === src/auth/auth.service.ts ===
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '../users/user.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService, 
  ) {}

  async register(dto: RegisterDto): Promise<{ access_token: string }> {
    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
  
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashed });
    await this.userRepo.save(user);
    return this.generateToken(user);
  }

  async login(dto: LoginDto): Promise<{ access_token: string, user: any }> {
  const user = await this.userRepo.findOne({ where: { email: dto.email } });

  if (!user || !(await bcrypt.compare(dto.password, user.password))) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const { access_token } = this.generateToken(user);

  return {
    access_token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}


  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
