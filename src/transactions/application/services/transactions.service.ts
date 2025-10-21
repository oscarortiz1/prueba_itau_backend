import { Injectable } from '@nestjs/common';

import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionsRepository } from '../../infrastructure/repositories/transactions.repository';
import { TransactionsGateway } from '../../transactions.gateway';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../../dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly transactionsGateway: TransactionsGateway,
  ) {}

  findByUser(userId: string): Promise<Transaction[]> {
    return this.transactionsRepository.findByUser(userId);
  }

  async create(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = await this.transactionsRepository.create({
      userId,
      type: dto.type,
      title: dto.title,
      amount: dto.amount,
      category: dto.category,
      occurredAt: new Date(dto.occurredAt),
    });

    this.transactionsGateway.emitCreated(userId, transaction);
    return transaction;
  }

  async update(userId: string, transactionId: string, dto: UpdateTransactionDto): Promise<Transaction> {
    const changes: Record<string, unknown> = {};
    if (dto.type) {
      changes.type = dto.type;
    }
    if (dto.title) {
      changes.title = dto.title;
    }
    if (dto.amount !== undefined) {
      changes.amount = dto.amount;
    }
    if (dto.category !== undefined) {
      changes.category = dto.category;
    }
    if (dto.occurredAt) {
      changes.occurredAt = new Date(dto.occurredAt);
    }

    const transaction = await this.transactionsRepository.update(userId, transactionId, changes);
    this.transactionsGateway.emitUpdated(userId, transaction);
    return transaction;
  }

  async remove(userId: string, transactionId: string): Promise<void> {
    await this.transactionsRepository.delete(userId, transactionId);
    this.transactionsGateway.emitDeleted(userId, transactionId);
  }
}
