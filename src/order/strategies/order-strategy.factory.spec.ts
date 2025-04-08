import { OrderStrategyFactory } from './order-strategy.factory';
import { LimitOrderStrategy } from './limit-order.strategy';
import { MarketOrderStrategy } from './market-order.strategy';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderType } from '../dto/create-order.dto';

describe('OrderStrategyFactory', () => {
  let factory: OrderStrategyFactory;
  let limitStrategy: LimitOrderStrategy;
  let marketStrategy: MarketOrderStrategy;

  beforeEach(() => {
    const mockPrismaService = {
      marketData: {
        findFirst: jest.fn(),
      },
    } as unknown as PrismaService;

    marketStrategy = new MarketOrderStrategy(mockPrismaService);
    limitStrategy = new MarketOrderStrategy(mockPrismaService);

    factory = new OrderStrategyFactory(marketStrategy, limitStrategy);
  });

  it('should return LimitOrderStrategy for LIMIT order type', () => {
    const strategy = factory.getStrategy(OrderType.LIMIT);
    expect(strategy).toBe(limitStrategy);
  });

  it('should return MarketOrderStrategy for MARKET order type', () => {
    const strategy = factory.getStrategy(OrderType.MARKET);
    expect(strategy).toBe(marketStrategy);
  });

  it('should throw BadRequestException for unknown order type', () => {
    expect(() => factory.getStrategy('UNKNOWN' as OrderType)).toThrow(BadRequestException);
  });
});
