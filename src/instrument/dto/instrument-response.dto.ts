export class InstrumentResponseDto {
    id: number;
    ticker: string;
    name: string;
    type: string;
  
    constructor(partial: Partial<InstrumentResponseDto>) {
      Object.assign(this, partial);
    }
}