import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

describe('AssetService', () => {
  let service: AssetService;
  let prisma: Partial<PrismaService>;

  beforeEach(async () => {
    prisma = {
      order: {
        groupBy: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
      instrument: {
        findUnique: jest.fn(),
      },
      marketData: {
        findFirst: jest.fn(),
      },
    } as unknown as PrismaService;
  
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
  
    service = module.get<AssetService>(AssetService);
  });

  it('should return assets with correct values and performance', async () => {
    (prisma.order!.groupBy as jest.Mock).mockResolvedValue([
      {
        instrumentId: 1,
        _sum: { size: new Decimal(10) },
      },
    ]);

    (prisma.instrument!.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      ticker: 'AAPL',
      name: 'Apple',
    });

    (prisma.marketData!.findFirst as jest.Mock).mockResolvedValue({
      close: new Decimal(200),
      previousClose: new Decimal(180),
    });

    const result = await service.getAssets(1);

    expect(result).toEqual([
      {
        instrumentId: 1,
        ticker: 'AAPL',
        name: 'Apple',
        quantity: 10,
        totalValue: 2000,
        rendimiento: ((200 - 180) / 180) * 100,
      },
    ]);
  });

  it('should return performance 0 when there is no marketData', async () => {
    prisma.order!.groupBy = jest.fn().mockResolvedValue([
      { instrumentId: 1, _sum: { size: new Decimal(5) } },
    ]);

    prisma.instrument!.findUnique = jest.fn().mockResolvedValue({
      ticker: 'TSLA',
      name: 'Tesla',
    });

    prisma.marketData!.findFirst = jest.fn().mockResolvedValue(null);

    const result = await service.getAssets(1);

    expect(result).toEqual([
      {
        instrumentId: 1,
        ticker: 'TSLA',
        name: 'Tesla',
        quantity: 5,
        totalValue: 0,
        rendimiento: 0,
      },
    ]);
  });

  it('should return performance 0 when previousClose is missing', async () => {
    prisma.order!.groupBy = jest.fn().mockResolvedValue([
      { instrumentId: 2, _sum: { size: new Decimal(8) } },
    ]);

    prisma.instrument!.findUnique = jest.fn().mockResolvedValue({
      ticker: 'GOOG',
      name: 'Google',
    });

    prisma.marketData!.findFirst = jest.fn().mockResolvedValue({
      close: new Decimal(100),
      previousClose: null,
    });

    const result = await service.getAssets(1);

    expect(result).toEqual([
      {
        instrumentId: 2,
        ticker: 'GOOG',
        name: 'Google',
        quantity: 8,
        totalValue: 800,
        rendimiento: 0,
      },
    ]);
  });
  
});
