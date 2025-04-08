import { Test, TestingModule } from '@nestjs/testing';
import { OrderRepository } from './order.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderSide } from '../enums/order-side.enums';
import { OrderStatus } from '../enums/order-status.enum';
import { Decimal } from '@prisma/client/runtime/library';

describe('OrderRepository', () => {
  let repository: OrderRepository;
  let prisma: Partial<Record<keyof PrismaService, any>>;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
      instrument: {
        findUnique: jest.fn(),
      },
      order: {
        create: jest.fn(),
        aggregate: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepository,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    repository = module.get<OrderRepository>(OrderRepository);
  });

  it('should return true if user exists', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await repository.userExists(1);
    expect(result).toBe(true);
  });

  it('should return false if user does not exist', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await repository.userExists(999);
    expect(result).toBe(false);
  });

  it('should return true if instrument exists', async () => {
    (prisma.instrument.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await repository.instrumentExists(1);
    expect(result).toBe(true);
  });

  it('should return false if instrument does not exist', async () => {
    (prisma.instrument.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await repository.instrumentExists(999);
    expect(result).toBe(false);
  });

  it('should create an order with the correct data', async () => {
    const dto = {
      userId: 1,
      instrumentId: 2,
      side: OrderSide.BUY,
      type: 'MARKET',
    };

    const mockResponse = { id: 10, ...dto };
    (prisma.order.create as jest.Mock).mockResolvedValue(mockResponse);

    const result = await repository.createOrder(dto as any, new Decimal(5), new Decimal(100), OrderStatus.FILLED);

    expect(prisma.order.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 1,
        instrumentId: 2,
        side: OrderSide.BUY,
        type: 'MARKET',
        price: 100,
        size: 5,
        status: OrderStatus.FILLED,
        datetime: expect.any(Date),
      }),
    });

    expect(result).toEqual(mockResponse);
  });

  it('should calculate available cash correctly', async () => {
    (prisma.order.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { size: 1000 } }) // CASH_IN
      .mockResolvedValueOnce({ _sum: { size: 200 } }); // CASH_OUT + BUY

    const result = await repository.getAvailableCash(1);
    expect(result.equals(new Decimal(800))).toBe(true);
  });

  it('should return 0 available cash if no transactions', async () => {
    (prisma.order.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { size: null } }) // CASH_IN
      .mockResolvedValueOnce({ _sum: { size: null } }); // CASH_OUT + BUY

    const result = await repository.getAvailableCash(1);
    expect(result.equals(new Decimal(0))).toBe(true);
  });

  it('should calculate holdings correctly', async () => {
    (prisma.order.aggregate as jest.Mock).mockResolvedValue([{ _sum: { size: 15 } }]);

    const result = await repository.getHoldings(1, 1);
    expect(result.equals(new Decimal(15))).toBe(true);
  });

  it('should return 0 holdings if no transactions', async () => {
    (prisma.order.aggregate as jest.Mock).mockResolvedValue([{ _sum: { size: null } }]);

    const result = await repository.getHoldings(1, 1);
    expect(result.equals(new Decimal(0))).toBe(true);
  });
});
