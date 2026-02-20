import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistroDto {
  @ApiProperty({
    description: 'Contenido del registro',
    example: 'Mi primer registro',
    maxLength: 500,
  })
  @IsNotEmpty({message: 'El campo no puede estar vacío'})
  @IsString({message: 'El campo tiene que ser una cadena de texto'})
  @MinLength(3, {message: 'El campo debe tener al menos 3 caracteres'})
  @MaxLength(500, {message: 'El campo no puede tener más de 500 caracteres'})
  // Evita caracteres de control y secuencias maliciosas
  @Matches(/^[a-zA-Z0-9\s.,;:!?()&@#$%\-'"\n\r]*$/, {
    message: 'El campo contiene caracteres no permitidos'
  })
  registro: string;
}
