import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: 'CONFIRMED' })
  @IsEnum(OrderStatus)
  orderStatus!: OrderStatus;
}

export class UpdatePaymentStatusDto {
  @ApiProperty({ enum: PaymentStatus, example: 'PAID' })
  @IsEnum(PaymentStatus)
  paymentStatus!: PaymentStatus;
}