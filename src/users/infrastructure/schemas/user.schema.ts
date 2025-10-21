import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'users' })
export class UserPersistence {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<UserPersistence>;

export const USER_MODEL_NAME = UserPersistence.name;

export const UserSchema = SchemaFactory.createForClass(UserPersistence);
