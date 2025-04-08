import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderType } from '../dto/create-order.dto';
import { MarketOrderStrategy } from './market-order.strategy';
import { LimitOrderStrategy } from './limit-order.strategy';
import { OrderStrategy } from '../interfaces/order-strategy.interface';

@Injectable()
export class OrderStrategyFactory {
  constructor(
    private marketOrder: MarketOrderStrategy,
    private limitOrder: LimitOrderStrategy,
  ) {}

  getStrategy(type: OrderType): OrderStrategy {
    switch (type) {
      case OrderType.MARKET:
        return this.marketOrder;
      case OrderType.LIMIT:
        return this.limitOrder;
      default:
        throw new BadRequestException('Tipo de orden no soportado');
    }
  }
}
