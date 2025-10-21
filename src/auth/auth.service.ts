import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/application/services/users.service';
import { SafeUser, User } from '../users/domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email.toLowerCase(), hashedPassword);
    return this.toSafeUser(user);
  }

  async validateUser(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.usersService.findByEmail(email.toLowerCase());
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return this.toSafeUser(user);
  }

  async login(user: SafeUser): Promise<{ accessToken: string; user: SafeUser }> {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user,
    };
  }

  private toSafeUser(user: User): SafeUser {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }
}
