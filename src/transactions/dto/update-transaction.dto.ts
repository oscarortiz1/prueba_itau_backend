import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(['income', 'expense'], { message: 'Tipo invalido.' })
  readonly type?: 'income' | 'expense';

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  readonly title?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  readonly amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  readonly category?: string;

  @IsOptional()
  @IsDateString()
  readonly occurredAt?: string;
}
