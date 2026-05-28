import { IsInt, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 1, description: 'Catering Plan ID to subscribe to' })
  @IsInt()
  cateringPlanId!: number;

  @ApiProperty({ example: 7, description: 'Subscription duration: 7 (1 week), 14 (2 weeks), or 30 (1 month) days' })
  @IsInt()
  @IsIn([7, 14, 30])
  durationDays!: number;
}