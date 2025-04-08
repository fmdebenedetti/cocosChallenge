import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderSide, OrderType } from './dto/create-order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate order creation to OrderService', async () => {
    const dto: CreateOrderDto = {
      userId: 1,
      instrumentId: 1,
      side: OrderSide.BUY,
      type: OrderType.LIMIT,
      size: 10,
      price: 100,
    };

    const mockResult = { id: 1, ...dto };
    mockOrderService.createOrder.mockResolvedValue(mockResult);

    const result = await controller.create(dto);

    expect(service.createOrder).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });
});
