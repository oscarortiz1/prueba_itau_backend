import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionsService } from '../application/services/transactions.service';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller({ path: 'transactions', version: '1' })
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.transactionsService.findByUser(req.user.userId);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.userId, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.transactionsService.remove(req.user.userId, id);
  }
}
