import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TimeoutInterceptor } from './timeout.interceptor';
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TimeoutInterceptor());
  await app.listen(3000)

  // Configuración de validación
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
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
  
  // Configuración de CORS restringida solo a Vercel
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'https://my-repository-seven-hazel.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`La biblioteca se ubica en: http://localhost:${process.env.PORT}`);
  console.log(`Consulta de libros en: http://localhost:${process.env.PORT}/api`);
}
bootstrap();
