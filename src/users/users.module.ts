import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './application/services/users.service';
import { UsersRepository } from './infrastructure/repositories/users.repository';
import { USER_MODEL_NAME, UserSchema } from './infrastructure/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: USER_MODEL_NAME, schema: UserSchema }])],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
