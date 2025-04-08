import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

describe('AccountController', () => {
  let controller: AccountController;
  const mockService = {
    findOne: jest.fn().mockResolvedValue('mocked value'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [{ provide: AccountService, useValue: mockService }],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.findOne', async () => {
    const result = await controller.findOne('test@email.com');
    expect(result).toBe('mocked value');
    expect(mockService.findOne).toHaveBeenCalledWith('test@email.com');
  });
});
