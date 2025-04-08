import { Injectable } from "@nestjs/common";

@Injectable()
export class FormatterService {
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
  }

  formatPercentage(value: number): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value / 100);
  }
}
