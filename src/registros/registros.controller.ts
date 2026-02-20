import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RegistrosService } from './registros.service';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { UpdateRegistroDto } from './dto/update-registro.dto';
import { AntiSpamService } from './anti-spam.service';

@ApiTags('registros')
@Controller('registros')
export class RegistrosController {
  constructor(
    private readonly registrosService: RegistrosService,
    private readonly antiSpamService: AntiSpamService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro' })
  @ApiResponse({ status: 201, description: 'Registro creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o spam detectado' })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones' })
  create(@Body() createRegistroDto: CreateRegistroDto, @Ip() clientIp: string) {
    // Validar anti-spam ANTES de crear
    this.antiSpamService.validateContent(createRegistroDto.registro, clientIp);
    
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

  @Delete()
  @ApiOperation({ summary: 'Eliminar todos los registros (requiere token de confirmación)' })
  @ApiQuery({ name: 'token', required: true, type: String, description: 'Token de confirmación para borrar todos los registros' })
  @ApiResponse({ status: 200, description: 'Todos los registros fueron eliminados exitosamente' })
  @ApiResponse({ status: 400, description: 'Token de confirmación inválido' })
  removeAll(@Query('token') token?: string) {
    return this.registrosService.removeAll(token || '');
  }
}
