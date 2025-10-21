import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { TransactionsService } from './application/services/transactions.service';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsRepository } from './infrastructure/repositories/transactions.repository';
import { TRANSACTION_MODEL_NAME, TransactionSchema } from './infrastructure/schemas/transaction.schema';
import { TransactionsGateway } from './transactions.gateway';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    AuthModule,
    MongooseModule.forFeature([{ name: TRANSACTION_MODEL_NAME, schema: TransactionSchema }]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository, TransactionsGateway],
  exports: [TransactionsService],
})
export class TransactionsModule {}
