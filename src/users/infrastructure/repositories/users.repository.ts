import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../../domain/entities/user.entity';
import { USER_MODEL_NAME, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
  @InjectModel(USER_MODEL_NAME)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const created = await this.userModel.create({ email, password });
    return this.toDomain(created);
  }

  async findByEmail(email: string): Promise<User | null> {
    const document = await this.userModel.findOne({ email }).exec();
    return document ? this.toDomain(document) : null;
  }

  async findById(id: string): Promise<User | null> {
    const document = await this.userModel.findById(id).exec();
    return document ? this.toDomain(document) : null;
  }

  private toDomain(document: UserDocument): User {
    return {
  id: document.id,
      email: document.email,
      password: document.password,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
