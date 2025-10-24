import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'nuevo.usuario@correo.com', description: 'Correo electrónico válido para el nuevo usuario.' })
  @IsEmail({}, { message: 'Correo invalido.' })
  readonly email: string;

  @ApiProperty({ example: 'ClaveSegura123', minLength: 8, description: 'Contraseña que se asignará al usuario.' })
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  readonly password: string;

  @ApiProperty({ example: 'ClaveSegura123', description: 'Confirmación de la contraseña para validar coincidencia.' })
  @IsNotEmpty()
  readonly confirmPassword: string;
}
