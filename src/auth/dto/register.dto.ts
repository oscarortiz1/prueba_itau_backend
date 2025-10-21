import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Correo invalido.' })
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  readonly password: string;

  @IsNotEmpty()
  readonly confirmPassword: string;
}
