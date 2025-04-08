import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto, OrderSide, OrderType } from './dto/create-order.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderStrategyFactory } from './strategies/order-strategy.factory';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private strategyFactory: OrderStrategyFactory
  ) {}

  async createOrder(dto: CreateOrderDto) {
    await this.userExist(dto.userId);
    await this.instrumentExist(dto.instrumentId);

    const strategy = this.strategyFactory.getStrategy(dto.type);
    const { size, price } = await strategy.execute(dto);

    const totalCost = size.mul(price);
    const availableCash = await this.getAvailableCash(dto.userId);
    const holdings = await this.getHoldings(dto.userId, dto.instrumentId);

    if (dto.side === OrderSide.BUY && totalCost.gt(availableCash)) {
      return this.saveRejectedOrder(dto, size, price, 'Fondos insuficientes');
    }

    if (dto.side === OrderSide.SELL && size.gt(holdings)) {
      return this.saveRejectedOrder(dto, size, price, 'Acciones insuficientes');
    }

    const status = dto.type === OrderType.MARKET ? 'FILLED' : 'NEW';

    return this.prisma.order.create({
      data: {
        userId: dto.userId,
        instrumentId: dto.instrumentId,
        side: dto.side,
        type: dto.type,
        price: price.toNumber(),
        size: size.toNumber(),
        status,
        datetime: new Date(),
      },
    });
  }

  private async userExist(userId: number){
    const user = await this.prisma.user.findUnique({ where: { id: userId} });
    if (!user) throw new NotFoundException('Usuario no encontrado');
  }

  private async instrumentExist(instrumentId: number){
    const instrument = await this.prisma.instrument.findUnique({ where: { id: instrumentId } });
    if (!instrument) throw new NotFoundException('Instrumento no encontrado');
  }

  private async saveRejectedOrder(dto: CreateOrderDto, size: Decimal, price: Decimal, reason: string) {
    await this.prisma.order.create({
      data: {
        userId: dto.userId,
        instrumentId: dto.instrumentId,
        side: dto.side,
        type: dto.type,
        price: price.toNumber(),
        size: size.toNumber(),
        status: 'REJECTED',
        datetime: new Date(),
      },
    });
    throw new BadRequestException(reason);
  }

  private async getAvailableCash(userId: number): Promise<Decimal> {
    const cashIn = await this.prisma.order.aggregate({
      where: { userId, side: 'CASH_IN', status: 'FILLED' },
      _sum: { size: true },
    });

    const cashOut = await this.prisma.order.aggregate({
      where: {
        userId,
        side: { in: ['CASH_OUT', 'BUY'] },
        status: 'FILLED',
      },
      _sum: { size: true },
    });

    return new Decimal(cashIn._sum.size || 0).minus(cashOut._sum.size || 0);
  }

  private async getHoldings(userId: number, instrumentId: number): Promise<Decimal> {
    const result = await this.prisma.order.groupBy({
      by: ['instrumentId'],
      where: {
        userId,
        instrumentId,
        side: { in: ['BUY', 'SELL'] },
        status: 'FILLED',
      },
      _sum: { size: true },
    });

    const net = result[0]?._sum?.size || 0;
    return new Decimal(net);
  }
}
