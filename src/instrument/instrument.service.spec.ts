import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentService } from './instrument.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('InstrumentService', () => {
  let service: InstrumentService;
  let prisma: PrismaService;

  const mockPrismaService = {
    instrument: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstrumentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<InstrumentService>(InstrumentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return instruments when found by ticker', async () => {
    const mockResult = [{ id: 1, ticker: 'GGAL', name: 'Grupo Galicia', type: 'stock' }];
    mockPrismaService.instrument.findMany.mockResolvedValue(mockResult);

    const result = await service.find({ ticker: 'GGAL' });

    expect(mockPrismaService.instrument.findMany).toHaveBeenCalledWith({
      where: { OR: [{ ticker: { contains: 'GGAL' } }] },
    });
    expect(result).toEqual(mockResult);
  });

  it('should return instruments when found by name', async () => {
    const mockResult = [{ id: 2, ticker: 'YPFD', name: 'YPF S.A.', type: 'stock' }];
    mockPrismaService.instrument.findMany.mockResolvedValue(mockResult);

    const result = await service.find({ name: 'YPF' });

    expect(mockPrismaService.instrument.findMany).toHaveBeenCalledWith({
      where: { OR: [{ name: { contains: 'YPF' } }] },
    });
    expect(result).toEqual(mockResult);
  });

  it('should throw BadRequestException if no parameters are provided', async () => {
    await expect(service.find({})).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if no instruments found', async () => {
    mockPrismaService.instrument.findMany.mockResolvedValue([]);

    await expect(service.find({ ticker: 'XXXX' })).rejects.toThrow(NotFoundException);
  });
});
