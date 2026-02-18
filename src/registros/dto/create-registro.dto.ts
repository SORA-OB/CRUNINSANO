import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistroDto {
  @ApiProperty({
    description: 'Contenido del registro',
    example: 'Mi primer registro',
  })
  @IsNotEmpty({message: 'El campo no puede estár vacío'})
  @IsString({message: 'El campo tiene que ser una cadena de texto'})
  @MinLength(3, {message: 'El campo debe tener al menos 3 caracteres'})
  @MaxLength(255, {message: 'El campo no puede tener más de 255 caracteres'})
  registro: string;
}
