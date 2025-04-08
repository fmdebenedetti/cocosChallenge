import { Controller, Get, Query } from '@nestjs/common';
import { InstrumentService } from './instrument.service';

@Controller('instrument')
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) {}

  @Get('search')
  find(
    @Query('ticker') ticker?: string,
    @Query('name') name?: string
  ) {
    return this.instrumentService.find({ticker, name});
  }
}
