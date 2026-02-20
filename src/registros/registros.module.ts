import { Module } from '@nestjs/common';
import { RegistrosService } from './registros.service';
import { RegistrosController } from './registros.controller';
import { AntiSpamService } from './anti-spam.service';

@Module({
  controllers: [RegistrosController],
  providers: [RegistrosService, AntiSpamService],
})
export class RegistrosModule {}
