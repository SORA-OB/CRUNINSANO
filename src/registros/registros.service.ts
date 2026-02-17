import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { UpdateRegistroDto } from './dto/update-registro.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegistrosService {
  constructor(private prisma: PrismaService) {}

  // CREATE - Crear un nuevo registro
  async create(createRegistroDto: CreateRegistroDto) {
    return this.prisma.registros.create({
      data: {
        registro: createRegistroDto.registro,
      },
    });
  }

  // READ - Obtener todos los registros
  async findAll() {
    return this.prisma.registros.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  // READ - Obtener un registro por ID
  async findOne(id: number) {
    const registro = await this.prisma.registros.findUnique({
      where: { id },
    });

    if (!registro) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }

    return registro;
  }

  // UPDATE - Actualizar un registro por ID
  async update(id: number, updateRegistroDto: UpdateRegistroDto) {
    // Verificar que el registro existe
    await this.findOne(id);

    return this.prisma.registros.update({
      where: { id },
      data: {
        registro: updateRegistroDto.registro,
      },
    });
  }

  // DELETE - Eliminar un registro por ID
  async remove(id: number) {
    // Verificar que el registro existe
    await this.findOne(id);

    return this.prisma.registros.delete({
      where: { id },
    });
  }
}
