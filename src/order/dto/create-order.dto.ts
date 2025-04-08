import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderStatus {
  FILLED = 'FILLED',
  NEW = 'NEW',
  REJECTED = 'REJECTED'
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  instrumentId: number;

  @IsNotEmpty()
  @IsEnum(OrderSide)
  side: OrderSide;

  @IsNotEmpty()
  @IsEnum(OrderType)
  type: OrderType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  size?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;
}
