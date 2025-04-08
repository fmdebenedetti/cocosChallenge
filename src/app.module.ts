import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { PrismaService } from './prisma/prisma.service';
import { InstrumentModule } from './instrument/instrument.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [AccountModule, InstrumentModule, OrderModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
