import { MarketOrderStrategy } from './market-order.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateOrderDto, OrderSide, OrderType } from '../dto/create-order.dto';

describe('MarketOrderStrategy', () => {
  let strategy: MarketOrderStrategy;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      marketData: {
        findFirst: jest.fn(),
      },
    } as any;

    strategy = new MarketOrderStrategy(prisma);
  });

  it('should return size and price when size is provided', async () => {
    const dto: CreateOrderDto = {
      userId: 1,
      instrumentId: 1,
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      size: 5,
    };

    (prisma.marketData.findFirst as jest.Mock).mockResolvedValue({
      close: 100,
    });

    const result = await strategy.execute(dto);

    expect(result).toEqual({
      size: new Decimal(5),
      price: new Decimal(100),
    });
  });

  it('should calculate size from amount and market price', async () => {
    const dto: CreateOrderDto = {
      userId: 1,
      instrumentId: 1,
      side: OrderSide.SELL,
      type: OrderType.MARKET,
      amount: 1000,
    };

    (prisma.marketData.findFirst as jest.Mock).mockResolvedValue({
      close: 250,
    });

    const result = await strategy.execute(dto);

    expect(result).toEqual({
      size: new Decimal(4), // 1000 / 250 = 4
      price: new Decimal(250),
    });
  });

  it('should throw NotFoundException when market data is missing', async () => {
    const dto: CreateOrderDto = {
      userId: 1,
      instrumentId: 1,
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      size: 10,
    };

    (prisma.marketData.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(strategy.execute(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when neither size nor amount is provided', async () => {
    const dto: CreateOrderDto = {
      userId: 1,
      instrumentId: 1,
      side: OrderSide.SELL,
      type: OrderType.MARKET,
    };

    (prisma.marketData.findFirst as jest.Mock).mockResolvedValue({
      close: 300,
    });

    await expect(strategy.execute(dto)).rejects.toThrow(BadRequestException);
  });
});
