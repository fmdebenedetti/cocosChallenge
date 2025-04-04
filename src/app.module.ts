import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { PrismaService } from './prisma/prisma.service';
import { InstrumentModule } from './instrument/instrument.module';

@Module({
  imports: [AccountModule, InstrumentModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
