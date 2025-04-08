import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CashService } from './services/cash.service';
import { AssetService } from './services/asset.service';
import { FormatterService } from './services/formatter.service';
import { NotFoundException } from '@nestjs/common';

describe('AccountService', () => {
  let service: AccountService;
  let prisma: { user: { findUnique: jest.Mock } };
  let cashService: Partial<CashService>;
  let assetService: Partial<AssetService>;
  let formatter: Partial<FormatterService>;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
    } as any;

    cashService = {
      getAvailableCash: jest.fn(),
    };

    assetService = {
      getAssets: jest.fn(),
    };

    formatter = {
      formatCurrency: jest.fn((value) => `$${value}`),
      formatPercentage: jest.fn((value) => `${value}%`),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: PrismaService, useValue: prisma },
        { provide: CashService, useValue: cashService },
        { provide: AssetService, useValue: assetService },
        { provide: FormatterService, useValue: formatter },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  describe('findOne', () => {
    it('should return account summary and assets', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (cashService.getAvailableCash as jest.Mock).mockResolvedValue(1000);
      (assetService.getAssets as jest.Mock).mockResolvedValue([
        {
          instrumentId: 1,
          ticker: 'AAPL',
          name: 'Apple',
          quantity: 10,
          totalValue: 2000,
          rendimiento: 5,
        },
      ]);

      const result = await service.findOne('test@email.com');

      expect(result).toEqual({
        resumenCuenta: {
          dineroDisponible: '$1000',
          valorTotalCuenta: '$3000',
        },
        activos: [
          {
            instrumentId: 1,
            ticker: 'AAPL',
            nombre: 'Apple',
            cantidad: 10,
            valorTotalPosicion: '$2000',
            rendimientoTotal: '5%',
          },
        ],
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne('no-user@email.com')).rejects.toThrow(NotFoundException);
    });
  });
});
