import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Transaction } from '../../domain/entities/transaction.entity';
import { TRANSACTION_MODEL_NAME, TransactionDocument } from '../schemas/transaction.schema';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectModel(TRANSACTION_MODEL_NAME)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  async create(data: {
    userId: string;
    type: 'income' | 'expense';
    title: string;
    amount: number;
    category?: string;
    occurredAt: Date;
  }): Promise<Transaction> {
    const created = await this.transactionModel.create(data);
    return this.toDomain(created);
  }

  async findByUser(userId: string): Promise<Transaction[]> {
    const documents = await this.transactionModel
      .find({ userId })
      .sort({ occurredAt: -1, createdAt: -1 })
      .exec();

    return documents.map(this.toDomain);
  }

  async update(
    userId: string,
    id: string,
    changes: Partial<{
      type: 'income' | 'expense';
      title: string;
      amount: number;
      category?: string;
      occurredAt: Date;
    }>,
  ): Promise<Transaction> {
    const document = await this.transactionModel
      .findOneAndUpdate({ _id: id, userId }, changes, { new: true })
      .exec();

    if (!document) {
      throw new NotFoundException('Transaccion no encontrada.');
    }

    return this.toDomain(document);
  }

  async delete(userId: string, id: string): Promise<void> {
    const result = await this.transactionModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Transaccion no encontrada.');
    }
  }

  private toDomain = (document: TransactionDocument): Transaction => ({
    id: document.id,
    userId: document.userId.toString(),
    type: document.type,
    title: document.title,
    amount: document.amount,
    category: document.category,
    occurredAt: document.occurredAt,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  });
}
