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
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,        // 1 segundo
        limit: 3,         // Máximo 3 peticiones por segundo (protege contra ataques DoS rápidos)
      },
      {
        name: 'long',
        ttl: 60000,       // 1 minuto
        limit: 50,        // Máximo 50 peticiones por minuto por IP
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
