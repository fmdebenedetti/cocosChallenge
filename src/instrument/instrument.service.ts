import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { isEmpty } from 'lodash';
import { InstrumentResponseDto } from './dto/instrument-response.dto';

@Injectable()
export class InstrumentService {

  constructor (private prismaService: PrismaService){}

  async find({ ticker, name }: { ticker?: string; name?: string }) {
    if (!ticker && !name) {
      throw new BadRequestException('You must provide at least one search parameter (ticker or name).');
    }
  
    const where = {
      OR: [] as { ticker?: { contains: string }; name?: { contains: string } }[],
    };

    if (ticker) {
      where.OR.push({ ticker: { contains: ticker } });
    }

    if (name) {
      where.OR.push({ name: { contains: name } });
    }
    const instrument = await this.prismaService.instrument.findMany({ where });

    if (isEmpty(instrument)) {
      throw new NotFoundException('No instrument found with the given ticker or name.');
    }
      
    return instrument.map(i => new InstrumentResponseDto(i));
  }
}
