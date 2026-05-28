import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Diet' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Healthy diet plans for weight loss' })
  @IsOptional()
  @IsString()
  description?: string;
}