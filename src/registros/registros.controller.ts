import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RegistrosService } from './registros.service';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { UpdateRegistroDto } from './dto/update-registro.dto';

@ApiTags('registros')
@Controller('registros')
export class RegistrosController {
  constructor(private readonly registrosService: RegistrosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro' })
  @ApiResponse({ status: 201, description: 'Registro creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createRegistroDto: CreateRegistroDto) {
    return this.registrosService.create(createRegistroDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros' })
  @ApiResponse({ status: 200, description: 'Lista de registros obtenida exitosamente' })
  findAll() {
    return this.registrosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro por ID' })
  @ApiParam({ name: 'id', description: 'ID del registro', type: Number })
  @ApiResponse({ status: 200, description: 'Registro encontrado' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  findOne(@Param('id') id: string) {
    return this.registrosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un registro por ID' })
  @ApiParam({ name: 'id', description: 'ID del registro', type: Number })
  @ApiResponse({ status: 200, description: 'Registro actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  update(@Param('id') id: string, @Body() updateRegistroDto: UpdateRegistroDto) {
    return this.registrosService.update(+id, updateRegistroDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un registro por ID' })
  @ApiParam({ name: 'id', description: 'ID del registro', type: Number })
  @ApiResponse({ status: 200, description: 'Registro eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  remove(@Param('id') id: string) {
    return this.registrosService.remove(+id);
  }
}
