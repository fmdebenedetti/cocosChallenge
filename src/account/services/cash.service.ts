import { Injectable } from "@nestjs/common";
import { Decimal } from "@prisma/client/runtime/library";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CashService {
  constructor(private prismaService: PrismaService) {}

  async getAvailableCash(userId: number): Promise<number> {
    const cashIn = await this.prismaService.order.aggregate({
        where: { userId, side: 'CASH_IN', status: 'FILLED' },
        _sum: { size: true },
    });
        
    const cashOut = await this.prismaService.order.aggregate({
        where: { userId, side: 'CASH_OUT', status: 'FILLED' },
        _sum: { size: true },
    });
        
    return new Decimal(cashIn._sum.size || 0).minus(cashOut._sum.size || 0).toNumber();
  }
}
