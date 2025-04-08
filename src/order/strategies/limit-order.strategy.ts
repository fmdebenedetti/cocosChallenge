import { CreateOrderDto } from '../dto/create-order.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { Injectable, BadRequestException } from '@nestjs/common';
import { OrderStrategy } from '../interfaces/order-strategy.interface';
import { Order } from '@prisma/client';

@Injectable()
export class LimitOrderStrategy implements OrderStrategy {

  async execute(dto: CreateOrderDto): Promise<{ size: Decimal, price: Decimal }> {
    if (!dto.price) throw new BadRequestException('Debe enviar el precio para una orden LIMIT');
    const price = new Decimal(dto.price);

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
