import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from './repositories/order.repository';
import { OrderStrategyFactory } from './strategies/order-strategy.factory';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderSide, OrderType } from './dto/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: Partial<OrderRepository>;
  let strategyFactory: Partial<OrderStrategyFactory>;

  beforeEach(async () => {
    orderRepository = {
      userExists: jest.fn(),
      instrumentExists: jest.fn(),
      getAvailableCash: jest.fn(),
      getHoldings: jest.fn(),
      createOrder: jest.fn(),
    };

    strategyFactory = {
      getStrategy: jest.fn().mockReturnValue({
        execute: jest.fn().mockResolvedValue({
          size: new Decimal(10),
          price: new Decimal(100),
        }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: OrderRepository, useValue: orderRepository },
        { provide: OrderStrategyFactory, useValue: strategyFactory },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
  });

  const baseDto = {
    userId: 1,
    instrumentId: 1,
  };

  it('should create a MARKET order when everything is valid', async () => {
    const dto = { ...baseDto, side: OrderSide.BUY, type: OrderType.MARKET };

    (orderRepository.userExists as jest.Mock).mockResolvedValue(true);
    (orderRepository.instrumentExists as jest.Mock).mockResolvedValue(true);
    (orderRepository.getAvailableCash as jest.Mock).mockResolvedValue(new Decimal(2000));
    (orderRepository.getHoldings as jest.Mock).mockResolvedValue(new Decimal(100));

    await orderService.createOrder(dto as any);

    expect(orderRepository.createOrder).toHaveBeenCalledWith(
      dto,
      new Decimal(10),
      new Decimal(100),
      OrderStatus.FILLED,
    );
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const dto = { ...baseDto, side: OrderSide.BUY, type: OrderType.MARKET };
    (orderRepository.userExists as jest.Mock).mockResolvedValue(false);

    await expect(orderService.createOrder(dto as any)).rejects.toThrow(NotFoundException);
  });

  it('should reject BUY order if user has insufficient cash', async () => {
    const dto = { ...baseDto, side: OrderSide.BUY, type: OrderType.MARKET };

    (orderRepository.userExists as jest.Mock).mockResolvedValue(true);
    (orderRepository.instrumentExists as jest.Mock).mockResolvedValue(true);
    (orderRepository.getAvailableCash as jest.Mock).mockResolvedValue(new Decimal(100)); // < 10 * 100
    (orderRepository.getHoldings as jest.Mock).mockResolvedValue(new Decimal(100));

    await expect(orderService.createOrder(dto as any)).rejects.toThrow(BadRequestException);
    expect(orderRepository.createOrder).toHaveBeenCalledWith(
      dto,
      new Decimal(10),
      new Decimal(100),
      OrderStatus.REJECTED,
    );
  });

  it('should reject SELL order if user has insufficient holdings', async () => {
    const dto = { ...baseDto, side: OrderSide.SELL, type: OrderType.MARKET };

    (orderRepository.userExists as jest.Mock).mockResolvedValue(true);
    (orderRepository.instrumentExists as jest.Mock).mockResolvedValue(true);
    (orderRepository.getAvailableCash as jest.Mock).mockResolvedValue(new Decimal(1000));
    (orderRepository.getHoldings as jest.Mock).mockResolvedValue(new Decimal(5)); // < size (10)

    await expect(orderService.createOrder(dto as any)).rejects.toThrow(BadRequestException);
    expect(orderRepository.createOrder).toHaveBeenCalledWith(
      dto,
      new Decimal(10),
      new Decimal(100),
      OrderStatus.REJECTED,
    );
  });

  it('should create a LIMIT order with NEW status', async () => {
    const dto = { ...baseDto, side: OrderSide.BUY, type: OrderType.LIMIT };

    (orderRepository.userExists as jest.Mock).mockResolvedValue(true);
    (orderRepository.instrumentExists as jest.Mock).mockResolvedValue(true);
    (orderRepository.getAvailableCash as jest.Mock).mockResolvedValue(new Decimal(2000));
    (orderRepository.getHoldings as jest.Mock).mockResolvedValue(new Decimal(100));

    await orderService.createOrder(dto as any);

    expect(orderRepository.createOrder).toHaveBeenCalledWith(
      dto,
      new Decimal(10),
      new Decimal(100),
      OrderStatus.NEW,
    );
  });

  it('should throw NotFoundException if instrument does not exist', async () => {
    const dto = { ...baseDto, side: OrderSide.BUY, type: OrderType.MARKET };
  
    (orderRepository.userExists as jest.Mock).mockResolvedValue(true);
    (orderRepository.instrumentExists as jest.Mock).mockResolvedValue(false);
  
    await expect(orderService.createOrder(dto as any)).rejects.toThrow(NotFoundException);
  });

  it('should call getStrategy with correct order type', async () => {
    const dto = { ...baseDto, side: OrderSide.BUY, type: OrderType.LIMIT };
  
    (orderRepository.userExists as jest.Mock).mockResolvedValue(true);
    (orderRepository.instrumentExists as jest.Mock).mockResolvedValue(true);
    (orderRepository.getAvailableCash as jest.Mock).mockResolvedValue(new Decimal(2000));
    (orderRepository.getHoldings as jest.Mock).mockResolvedValue(new Decimal(100));
  
    await orderService.createOrder(dto as any);
  
    expect(strategyFactory.getStrategy).toHaveBeenCalledWith(OrderType.LIMIT);
  });

  it('should use values from strategy.execute()', async () => {
    const executeSpy = jest.fn().mockResolvedValue({
      size: new Decimal(20),
      price: new Decimal(50),
    });
  
    (strategyFactory.getStrategy as jest.Mock).mockReturnValue({ execute: executeSpy });
  
    const dto = { ...baseDto, side: OrderSide.BUY, type: OrderType.MARKET };
  
    (orderRepository.userExists as jest.Mock).mockResolvedValue(true);
    (orderRepository.instrumentExists as jest.Mock).mockResolvedValue(true);
    (orderRepository.getAvailableCash as jest.Mock).mockResolvedValue(new Decimal(2000));
    (orderRepository.getHoldings as jest.Mock).mockResolvedValue(new Decimal(100));
  
    await orderService.createOrder(dto as any);
  
    expect(orderRepository.createOrder).toHaveBeenCalledWith(
      dto,
      new Decimal(20),
      new Decimal(50),
      OrderStatus.FILLED
    );
  });  
});
