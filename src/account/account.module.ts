import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssetService } from './services/asset.service';
import { CashService } from './services/cash.service';
import { FormatterService } from './services/formatter.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService, PrismaService, CashService, AssetService, FormatterService],
})
export class AccountModule {}
