import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateTransactionDto {
  @ApiPropertyOptional({ enum: ['income', 'expense'], example: 'expense', description: 'Actualiza el tipo de la transacción.' })
  @IsOptional()
  @IsEnum(['income', 'expense'], { message: 'Tipo invalido.' })
  readonly type?: 'income' | 'expense';

  @ApiPropertyOptional({ example: 'Compra supermercado', minLength: 2, maxLength: 80, description: 'Nuevo título para la transacción.' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  readonly title?: string;

  @ApiPropertyOptional({ example: 320.75, minimum: 0, description: 'Nuevo monto de la transacción.' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  readonly amount?: number;

  @ApiPropertyOptional({ example: 'Alimentos', maxLength: 60, description: 'Nueva categoría para clasificar la transacción.' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  readonly category?: string;

  @ApiPropertyOptional({ example: '2025-10-15T15:30:00.000Z', description: 'Fecha actualizada en la que ocurrió la transacción.' })
  @IsOptional()
  @IsDateString()
  readonly occurredAt?: string;
}
