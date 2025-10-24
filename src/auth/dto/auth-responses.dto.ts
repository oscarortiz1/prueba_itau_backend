import { ApiProperty } from '@nestjs/swagger';

export class SafeUserDto {
  @ApiProperty({ example: '67205e6f2b1d88c1b5f8c123', description: 'Identificador único del usuario.' })
  id: string;

  @ApiProperty({ example: 'usuario@correo.com', description: 'Correo electrónico del usuario.' })
  email: string;

  @ApiProperty({ example: '2025-10-20T18:30:00.000Z', description: 'Fecha de creación del usuario.', type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ example: '2025-10-21T09:15:00.000Z', description: 'Fecha de última actualización del usuario.', type: String, format: 'date-time' })
  updatedAt: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'Usuario registrado correctamente.', description: 'Mensaje de confirmación de registro.' })
  message: string;

  @ApiProperty({ type: () => SafeUserDto })
  user: SafeUserDto;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token JWT que debe utilizarse en el encabezado Authorization.' })
  accessToken: string;

  @ApiProperty({ type: () => SafeUserDto })
  user: SafeUserDto;
}
