import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentController } from './instrument.controller';
import { InstrumentService } from './instrument.service';

describe('InstrumentController', () => {
  let controller: InstrumentController;
  let service: InstrumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstrumentController],
      providers: [
        {
          provide: InstrumentService,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InstrumentController>(InstrumentController);
    service = module.get<InstrumentService>(InstrumentService);
  });

  describe('find', () => {
    it('should call InstrumentService.find with query params and return result', async () => {
        const mockResult = [
            { id: 1, ticker: 'GGAL', name: 'Grupo Galicia', type: 'stock' }
        ];
        jest.spyOn(service, 'find').mockResolvedValue(mockResult);

        const result = await controller.find('GGAL', 'Grupo Galicia');
        expect(service.find).toHaveBeenCalledWith({ ticker: 'GGAL', name: 'Grupo Galicia' });
        expect(result).toEqual(mockResult);
    });
  });
});
