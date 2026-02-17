import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistroDto {
  @ApiProperty({
    description: 'Contenido del registro',
    example: 'Mi primer registro',
  })
  @IsString()
  @IsNotEmpty()
  registro: string;
}
