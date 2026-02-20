import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegistrosModule } from './registros/registros.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PrismaModule, 
    RegistrosModule, 
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,        // 1 segundo
        limit: 2,         // REDUCIDO: Máximo 2 peticiones por segundo
      },
      {
        name: 'medium',
        ttl: 10000,       // 10 segundos
        limit: 10,        // Máximo 10 peticiones cada 10 segundos
      },
      {
        name: 'long',
        ttl: 60000,       // 1 minuto
        limit: 30,        // REDUCIDO: Máximo 30 peticiones por minuto
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Aplicar ThrottlerGuard globalmente a TODOS los endpoints
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
