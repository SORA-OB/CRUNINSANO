import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de validación
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API CRUD Registros')
    .setDescription('Documentación de la API CRUD para gestión de registros')
    .setVersion('1.0')
    .addTag('registros')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
  console.log(`La biblioteca se ubica en: http://localhost:${process.env.PORT}`);
  console.log(`Consulta de libros en: http://localhost:${process.env.PORT}/api`);
}
bootstrap();
