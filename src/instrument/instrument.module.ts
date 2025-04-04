import { Module } from '@nestjs/common';
import { InstrumentService } from './instrument.service';
import { InstrumentController } from './instrument.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [InstrumentController],
  providers: [InstrumentService, PrismaService],
})
export class InstrumentModule {}
