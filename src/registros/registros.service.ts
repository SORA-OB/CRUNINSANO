import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  // READ - Obtener todos los registros CON PAGINACIÓN
  async findAll(page: number = 1, limit: number = 20) {
    // Validación de seguridad
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;
    if (limit > 100) limit = 100; // Máximo 100 registros por página para evitar DoS

    const skip = (page - 1) * limit;

    const [registros, total] = await Promise.all([
      this.prisma.registros.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      }),
      this.prisma.registros.count(),
    ]);

    return {
      data: registros,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
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

  // DELETE - Eliminar todos los registros (CON CONFIRMACIÓN)
  async removeAll(confirmToken: string) {
    // Token de confirmación para evitar borrar todo accidentalmente
    const expectedToken = process.env.DELETE_ALL_TOKEN;
    
    if (confirmToken !== expectedToken) {
      throw new BadRequestException('Token de confirmación inválido. No se pueden borrar los registros.');
    }

    const result = await this.prisma.registros.deleteMany({});
    
    return {
      message: `Se han eliminado ${result.count} registros.`,
      deletedCount: result.count,
    };
  }
}
