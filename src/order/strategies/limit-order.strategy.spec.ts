import { LimitOrderStrategy } from './limit-order.strategy';
import { CreateOrderDto, OrderSide, OrderType } from '../dto/create-order.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { BadRequestException } from '@nestjs/common';

describe('LimitOrderStrategy', () => {
  let strategy: LimitOrderStrategy;

  beforeEach(() => {
    strategy = new LimitOrderStrategy();
  });

  it('should return size and price when size and price are provided', async () => {
    const dto: CreateOrderDto = {
      userId: 1,
      instrumentId: 1,
      side: OrderSide.BUY,
      type: OrderType.LIMIT,
      size: 10,
      price: 100,
    };

    const result = await strategy.execute(dto);

    expect(result).toEqual({
      size: new Decimal(10),
      price: new Decimal(100),
    });
  });

  it('should calculate size when amount is provided instead of size', async () => {
    const dto: CreateOrderDto = {
      userId: 1,
      instrumentId: 1,
      side: OrderSide.BUY,
      type: OrderType.LIMIT,
      amount: 1000,
      price: 100,
    };

    const result = await strategy.execute(dto);

    expect(result).toEqual({
      size: new Decimal(10), // 1000 / 100
      price: new Decimal(100),
    });
  });

  it('should throw BadRequestException if neither size nor amount is provided', async () => {
    const dto: CreateOrderDto = {
      userId: 1,
      instrumentId: 1,
      side: OrderSide.BUY,
      type: OrderType.LIMIT,
      price: 100,
    };

    await expect(strategy.execute(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if price is not provided', async () => {
    const dto: CreateOrderDto = {
      userId: 1,
      instrumentId: 1,
      side: OrderSide.BUY,
      type: OrderType.LIMIT,
      size: 10,
    };

    await expect(strategy.execute(dto)).rejects.toThrow(BadRequestException);
  });
});
