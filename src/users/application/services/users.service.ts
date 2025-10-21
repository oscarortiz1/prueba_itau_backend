import { ConflictException, Injectable } from '@nestjs/common';

import { User } from '../../domain/entities/user.entity';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(email: string, hashedPassword: string): Promise<User> {
    const existing = await this.usersRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('El correo ya se encuentra registrado.');
    }

    return this.usersRepository.create(email, hashedPassword);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }
}
