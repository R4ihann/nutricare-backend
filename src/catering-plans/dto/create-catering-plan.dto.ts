import { IsString, IsNumber, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCateringPlanDto {
  @ApiProperty({ example: 'Healthy Week Plan' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'A balanced diet plan for 7 days' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 7, description: 'Duration in days' })
  @IsInt()
  @Min(1)
  duration!: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 1, description: 'Category ID' })
  @IsInt()
  categoryId!: number;
}