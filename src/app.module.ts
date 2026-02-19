import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegistrosModule } from './registros/registros.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    PrismaModule, 
    RegistrosModule, 
    ThrottlerModule.forRoot([{
      ttl: 60000, // Tiempo en milisegundos (1 minuto)
      limit: 10,   // Máximo de peticiones por TTL
    }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
