import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateOrderDto, OrderSide, OrderType, OrderStatus } from './dto/create-order.dto';
import { OrderStrategyFactory } from './strategies/order-strategy.factory';
import { OrderRepository } from './repositories/order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly strategyFactory: OrderStrategyFactory,
    private readonly orderRepository: OrderRepository
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const userExists = await this.orderRepository.userExists(dto.userId);
    if (!userExists) throw new NotFoundException('Usuario no encontrado');

    const instrumentExists = await this.orderRepository.instrumentExists(dto.instrumentId);
    if (!instrumentExists) throw new NotFoundException('Instrumento no encontrado');

    const strategy = this.strategyFactory.getStrategy(dto.type);
    const { size, price } = await strategy.execute(dto);
    const totalCost = size.mul(price);

    const availableCash = await this.orderRepository.getAvailableCash(dto.userId);
    const holdings = await this.orderRepository.getHoldings(dto.userId, dto.instrumentId);

    if (dto.side === OrderSide.BUY && totalCost.gt(availableCash)) {
      return this.rejectOrder(dto, size, price, 'Fondos insuficientes');
    }

    if (dto.side === OrderSide.SELL && size.gt(holdings)) {
      return this.rejectOrder(dto, size, price, 'Acciones insuficientes');
    }

    const status = dto.type === OrderType.MARKET ? OrderStatus.FILLED : OrderStatus.NEW;
    return this.orderRepository.createOrder(dto, size, price, status);
  }

  private async rejectOrder(dto: CreateOrderDto, size: Decimal, price: Decimal, reason: string) {
    await this.orderRepository.createOrder(dto, size, price, OrderStatus.REJECTED);
    throw new BadRequestException(reason);
  }
}
