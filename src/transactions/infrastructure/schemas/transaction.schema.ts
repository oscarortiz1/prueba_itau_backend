import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

@Schema({ collection: 'transactions', timestamps: true })
export class TransactionPersistence {
  @Prop({ type: SchemaTypes.ObjectId, required: true, index: true })
  userId: string;

  @Prop({ required: true, enum: ['income', 'expense'] })
  type: 'income' | 'expense';

  @Prop({ required: true, trim: true, maxlength: 80 })
  title: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ trim: true, maxlength: 60 })
  category?: string;

  @Prop({ required: true })
  occurredAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export type TransactionDocument = HydratedDocument<TransactionPersistence>;

export const TRANSACTION_MODEL_NAME = TransactionPersistence.name;

export const TransactionSchema = SchemaFactory.createForClass(TransactionPersistence);
