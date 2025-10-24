import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

type TransactionType = 'income' | 'expense';

export class CreateTransactionDto {
  @ApiProperty({ enum: ['income', 'expense'], example: 'income', description: 'Tipo de transacción: ingreso o gasto.' })
  @IsEnum(['income', 'expense'], { message: 'Tipo invalido.' })
  readonly type: TransactionType;

  @ApiProperty({ example: 'Pago de nómina', minLength: 2, maxLength: 80, description: 'Descripción corta de la transacción.' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  readonly title: string;

  @ApiProperty({ example: 1500.5, minimum: 0, description: 'Monto asociado a la transacción. Se permiten hasta 2 decimales.' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  readonly amount: number;

  @ApiPropertyOptional({ example: 'Salario', maxLength: 60, description: 'Categoría opcional para clasificar la transacción.' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  readonly category?: string;

  @ApiProperty({ example: '2025-10-23T12:00:00.000Z', description: 'Fecha en la que ocurrió la transacción en formato ISO 8601.' })
  @IsDateString()
  readonly occurredAt: string;
}
