import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegistrosModule } from './registros/registros.module';

@Module({
  imports: [PrismaModule, RegistrosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
