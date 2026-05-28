import { IsInt, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 1, description: 'Catering Plan ID to subscribe to' })
  @IsInt()
  cateringPlanId!: number;

  @ApiProperty({ example: '2026-06-01', description: 'Start date (YYYY-MM-DD)' })
  @IsISO8601()
  startDate!: string;
}