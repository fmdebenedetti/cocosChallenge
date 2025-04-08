import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderSide } from '../enums/order-side.enums';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async userExists(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return !!user;
  }

  async instrumentExists(instrumentId: number): Promise<boolean> {
    const instrument = await this.prisma.instrument.findUnique({ where: { id: instrumentId } });
    return !!instrument;
  }

  async createOrder(dto: CreateOrderDto, size: Decimal, price: Decimal, status: string) {
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

  async getAvailableCash(userId: number): Promise<Decimal> {
    const cashIn = await this.prisma.order.aggregate({
      where: { userId, side: OrderSide.CASH_IN, status: OrderStatus.FILLED },
      _sum: { size: true },
    });

    const cashOut = await this.prisma.order.aggregate({
      where: {
        userId,
        side: { in: [OrderSide.CASH_OUT, OrderSide.BUY] },
        status: OrderStatus.FILLED,
      },
      _sum: { size: true },
    });

    return new Decimal(cashIn._sum.size || 0).minus(cashOut._sum.size || 0);
  }

  async getHoldings(userId: number, instrumentId: number): Promise<Decimal> {
    const result = await this.prisma.order.aggregate({
      where: {
        userId,
        instrumentId,
        side: { in: [OrderSide.BUY, OrderSide.SELL] },
        status: OrderStatus.FILLED,
      },
      _sum: { size: true },
    });

    const net = result[0]?._sum?.size || 0;
    return new Decimal(net);
  }
}
