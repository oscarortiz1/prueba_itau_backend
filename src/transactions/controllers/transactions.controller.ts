import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionsService } from '../application/services/transactions.service';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller({ path: 'transactions', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiTags('Transactions')
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtiene todas las transacciones del usuario autenticado.' })
  @ApiOkResponse({ description: 'Listado de transacciones.', type: TransactionResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente.' })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.transactionsService.findByUser(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Crea una nueva transacción.' })
  @ApiCreatedResponse({ description: 'Transacción creada correctamente.', type: TransactionResponseDto })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente.' })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una transacción existente.' })
  @ApiParam({ name: 'id', description: 'Identificador de la transacción a actualizar.' })
  @ApiOkResponse({ description: 'Transacción actualizada correctamente.', type: TransactionResponseDto })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  @ApiNotFoundResponse({ description: 'Transacción no encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente.' })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina una transacción.' })
  @ApiParam({ name: 'id', description: 'Identificador de la transacción a eliminar.' })
  @ApiNoContentResponse({ description: 'Transacción eliminada correctamente.' })
  @ApiNotFoundResponse({ description: 'Transacción no encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente.' })
  async remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    await this.transactionsService.remove(req.user.userId, id);
  }
}
