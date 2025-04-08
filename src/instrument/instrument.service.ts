import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InstrumentService {

  constructor (private prismaService: PrismaService){}

  async find({ ticker, name }: { ticker?: string; name?: string }) {
    if (!ticker && !name) {
      throw new BadRequestException('Debe proporcionar al menos un parámetro de búsqueda (ticker o name).');
    }
  
    const where: any = { OR: [] };

    if (ticker) {
      where.OR.push({ ticker: { contains: ticker} });
    }
    if (name) {
      where.OR.push({ name: { contains: name} });
    }

    const instrument = await this.prismaService.instrument.findMany({ where });

    if(!instrument || instrument.length === 0){
      throw new NotFoundException('Instrument with ticker or name not exist');
    }
      
    return instrument;
  }
}
