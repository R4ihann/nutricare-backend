import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 1, description: 'Catering Plan ID to subscribe to' })
  @IsInt()
  cateringPlanId!: number;
}