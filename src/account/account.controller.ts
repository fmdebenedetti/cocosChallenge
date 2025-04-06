import { Controller, Get, Param } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResponseDto } from './dto/account-response.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(':email')
  findOne(@Param('email') email: string): Promise<AccountResponseDto> {
    return this.accountService.findOne(email);
  }

}
