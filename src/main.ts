import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TimeoutInterceptor } from './timeout.interceptor';
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TimeoutInterceptor());

  // Configuración de validación
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Limitar tamaño de requests para prevenir DoS
  app.use((req, res, next) => {
    // Limite de 1MB por request
    req.on('data', (chunk) => {
      if ((req.socket as any).bytesRead > 1048576) { // 1MB
        res.status(413).json({ error: 'Payload too large' });
        req.socket.destroy();
      }
    });
    next();
  });

  // Headers de seguridad HTTP
  app.use((req, res, next) => {
    // Prevenir XSS
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Prevenir MIME type sniffing
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    
    // Prevenir referrer leakage
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Deshabilitar caching para datos sensibles
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    next();
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API CRUD Registros')
    .setDescription('Documentación de la API CRUD para gestión de registros')
    .setVersion('1.0')
    .addTag('registros')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Configuración de CORS restringida con verificación de origen
  const allowedOrigins = [
    process.env.CORS_ORIGIN,
    'http://localhost:3000',  // Frontend local (mismo puerto que el backend)
    'http://localhost:5173',  // Vite local
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origen (Postman, Thunder Client, etc.) solo en desarrollo
      if (!origin && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      // Verificar que el origen esté en la lista permitida
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 Origen bloqueado: ${origin}`);
        callback(new Error('No permitido por CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`La biblioteca se ubica en: http://localhost:${process.env.PORT}`);
  console.log(`Consulta de libros en: http://localhost:${process.env.PORT}/api`);
}
bootstrap();
