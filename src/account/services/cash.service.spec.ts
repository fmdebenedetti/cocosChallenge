import { Test, TestingModule } from '@nestjs/testing';
import { CashService } from './cash.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('CashService', () => {
  let service: CashService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const prismaMock = {
      order: {
        aggregate: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CashService>(CashService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should calculate available cash correctly', async () => {
    (prisma.order.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { size: 1500 } }) // CASH_IN
      .mockResolvedValueOnce({ _sum: { size: 500 } }); // CASH_OUT + BUY

    const result = await service.getAvailableCash(1);
    expect(result).toBe(1000);
  });

  it('should return 0 if no cash movements', async () => {
    (prisma.order.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { size: null } }) // CASH_IN
      .mockResolvedValueOnce({ _sum: { size: null } }); // CASH_OUT + BUY

    const result = await service.getAvailableCash(1);
    expect(result).toBe(0);
  });
});
