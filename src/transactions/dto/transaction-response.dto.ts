import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty({ example: '67205e6f2b1d88c1b5f8c456', description: 'Identificador único de la transacción.' })
  id: string;

  @ApiProperty({ example: '67205e6f2b1d88c1b5f8c123', description: 'Identificador del usuario dueño de la transacción.' })
  userId: string;

  @ApiProperty({ enum: ['income', 'expense'], example: 'expense', description: 'Tipo de la transacción.' })
  type: 'income' | 'expense';

  @ApiProperty({ example: 'Compra supermercado', description: 'Descripción breve de la transacción.' })
  title: string;

  @ApiProperty({ example: 325.5, description: 'Monto de la transacción.' })
  amount: number;

  @ApiPropertyOptional({ example: 'Alimentos', description: 'Categoría opcional asociada a la transacción.' })
  category?: string;

  @ApiProperty({ example: '2025-10-21T15:30:00.000Z', description: 'Fecha efectiva de la transacción.', type: String, format: 'date-time' })
  occurredAt: string;

  @ApiProperty({ example: '2025-10-22T10:00:00.000Z', description: 'Fecha de creación del registro.', type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ example: '2025-10-22T10:05:00.000Z', description: 'Fecha de última actualización del registro.', type: String, format: 'date-time' })
  updatedAt: string;
}
