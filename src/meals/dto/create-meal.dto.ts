import { IsString, IsNumber, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMealDto {
  @ApiProperty({ example: 'Grilled Chicken Salad' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 350 })
  @IsNumber()
  @Min(0)
  calories!: number;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @Min(0)
  protein!: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  carbs!: number;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(0)
  fat!: number;

  @ApiProperty({ example: 'Chicken breast, lettuce, tomato, olive oil' })
  @IsString()
  ingredients!: string;

  @ApiProperty({ example: 1, description: 'Catering Plan ID this meal belongs to' })
  @IsInt()
  cateringPlanId!: number;
}