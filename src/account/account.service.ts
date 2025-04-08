import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountResponseDto, AssetDto, AccountSummaryDto } from './dto/account-response.dto';
import { AssetService } from './services/asset.service';
import { FormatterService } from './services/formatter.service';
import { CashService } from './services/cash.service';

@Injectable()
export class AccountService {

  constructor(
    private prisma: PrismaService,
    private cashService: CashService,
    private assetService: AssetService,
    private formatter: FormatterService,
  ) {}

  async findOne(email: string): Promise<AccountResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException(`User with email ${email} not exist`);

    const [availableCash, assets] = await Promise.all([
      this.cashService.getAvailableCash(user.id),
      this.assetService.getAssets(user.id),
    ]);

    const totalAccountValue = availableCash + assets.reduce((acc, a) => acc + a.totalValue, 0);

    const resumenCuenta: AccountSummaryDto = {
      dineroDisponible: this.formatter.formatCurrency(availableCash),
      valorTotalCuenta: this.formatter.formatCurrency(totalAccountValue),
    };

    const activos: AssetDto[] = assets.map(a => ({
      instrumentId: a.instrumentId,
      ticker: a.ticker,
      nombre: a.name,
      cantidad: a.quantity,
      valorTotalPosicion: this.formatter.formatCurrency(a.totalValue),
      rendimientoTotal: this.formatter.formatPercentage(a.rendimiento),
    }));

    return { resumenCuenta, activos };
  }

}
