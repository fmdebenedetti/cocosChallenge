import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Decimal } from "@prisma/client/runtime/library";
import { OrderSide } from "src/order/enums/order-side.enums";

@Injectable()
export class AssetService {
  constructor(private prismaService: PrismaService) {}

  async getAssets(userId: number){
    const orderFound = await this.prismaService.order.groupBy({
        by: ['instrumentId'],
        where: { userId, side: { in: [OrderSide.BUY, OrderSide.SELL] }, status: OrderSide.FILLED },
        _sum: { size: true },
    });
      
    const assets = await Promise.all(
        orderFound.map(async (pos) => {
            const instrument = await this.prismaService.instrument.findUnique({
              where: { id: pos.instrumentId },
            });
      
            const marketData = await this.prismaService.marketData.findFirst({
              where: { instrumentId: pos.instrumentId },
              orderBy: { date: 'desc' },
            });
      
            const quantity = new Decimal(pos._sum.size || 0).toNumber();
            const closePrice = new Decimal(marketData?.close || 0).toNumber();
            const totalValue = quantity * closePrice;
      
            const rendimiento = marketData?.previousClose
              ? ((closePrice - new Decimal(marketData.previousClose).toNumber()) /
                  new Decimal(marketData.previousClose).toNumber()) * 100
              : 0;
      
            return {
              instrumentId: pos.instrumentId,
              ticker: instrument?.ticker,
              name: instrument?.name,
              quantity,
              totalValue: totalValue,
              rendimiento: rendimiento,
            };
        })
    );

    return assets;
  }
}
