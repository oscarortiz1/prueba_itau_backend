import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

type TransactionType = 'income' | 'expense';

export class CreateTransactionDto {
  @IsEnum(['income', 'expense'], { message: 'Tipo invalido.' })
  readonly type: TransactionType;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  readonly title: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  readonly amount: number;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  readonly category?: string;

  @IsDateString()
  readonly occurredAt: string;
}
