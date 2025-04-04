import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AccountService {

  constructor (private prismaService: PrismaService){}

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(email: string) {
    const userFound = await this.prismaService.user.findUnique({
      where: {
        email: email
      }
    });

    if(!userFound){
      throw new NotFoundException(`User with email ${email} not exist`);
    }

    const availableCash = await this.getAvailableCash(userFound.id);
    const assets = await this.getAssets(userFound.id);
    const totalAccountValue = availableCash + assets.reduce((acc, asset) => acc + asset.totalValue, 0);

    return {
      dineroDisponible: this.formatCurrency(availableCash),
      valorTotalCuenta: this.formatCurrency(totalAccountValue),
      activos: assets.map(asset => ({
        instrumentId: asset.instrumentId,
        ticker: asset.ticker,
        name: asset.name,
        cantidad: asset.quantity,
        valorTotalPosicion: this.formatCurrency(asset.totalValue),
        rendimientoTotal: this.formatPercentage(asset.rendimiento),
      }))};
  }

  private async getAvailableCash(userId): Promise<number>{
    const cashIn = await this.prismaService.order.aggregate({
      where: { userId, side: 'CASH_IN', status: 'FILLED' },
      _sum: { size: true },
    });
    
    const cashOut = await this.prismaService.order.aggregate({
      where: { userId, side: 'CASH_OUT', status: 'FILLED' },
      _sum: { size: true },
    });
    
    return (cashIn._sum.size || 0) - (cashOut._sum.size || 0);
  }

  async getAssets(userId: number) {
    const orderFound = await this.prismaService.order.groupBy({
      by: ['instrumentId'],
      where: { userId, side: { in: ['BUY', 'SELL'] }, status: 'FILLED' },
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

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  private formatPercentage(value: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  }

}
