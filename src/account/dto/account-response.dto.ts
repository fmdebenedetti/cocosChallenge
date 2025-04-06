export class AssetDto {
    instrumentId: number;
    ticker?: string;
    nombre?: string;
    cantidad: number;
    valorTotalPosicion: string;
    rendimientoTotal: string;
  }
  
  export class AccountSummaryDto {
    dineroDisponible: string;
    valorTotalCuenta: string;
  }
  
  export class AccountResponseDto {
    resumenCuenta: AccountSummaryDto;
    activos: AssetDto[];
  }