import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario@correo.com', description: 'Correo electrónico registrado del usuario.' })
  @IsEmail({}, { message: 'Correo invalido.' })
  readonly email: string;

  @ApiProperty({ example: 'ClaveSegura123', minLength: 8, description: 'Contraseña del usuario.' })
  @IsString()
  @MinLength(8)
  readonly password: string;
}
