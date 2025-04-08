import { CreateOrderDto } from '../dto/create-order.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStrategy } from '../interfaces/order-strategy.interface';
import { Order } from '@prisma/client';

@Injectable()
export class MarketOrderStrategy implements OrderStrategy {
  constructor(private prisma: PrismaService) {}

  async execute(dto: CreateOrderDto): Promise<{ size: Decimal, price: Decimal }> {
    const marketData = await this.prisma.marketData.findFirst({
      where: { instrumentId: dto.instrumentId },
      orderBy: { date: 'desc' },
    });

    if (!marketData) throw new NotFoundException('Datos de mercado no encontrados');
    const price = new Decimal(marketData.close);

    let size: Decimal;
    if (dto.size) {
      size = new Decimal(dto.size);
    } else if (dto.amount) {
      size = new Decimal(dto.amount).dividedBy(price).floor();
    } else {
      throw new BadRequestException('Debe enviar size o amount');
    }

    return { size, price };
  }
}
