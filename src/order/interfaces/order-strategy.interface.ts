import { CreateOrderDto } from "../dto/create-order.dto";
import { Decimal } from "@prisma/client/runtime/library";

export interface OrderStrategy {
    execute(dto: CreateOrderDto): Promise<{ size: Decimal, price: Decimal }>;
}
  