import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStrategyFactory } from './strategies/order-strategy.factory';
import { LimitOrderStrategy } from './strategies/limit-order.strategy';
import { MarketOrderStrategy } from './strategies/market-order.strategy';
import { OrderRepository } from './repositories/order.repository';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService, 
    PrismaService, 
    OrderStrategyFactory,
    MarketOrderStrategy,
    LimitOrderStrategy,
    OrderRepository
  ],
})
export class OrderModule {}
