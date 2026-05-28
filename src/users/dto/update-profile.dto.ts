import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 1, description: 'City ID' })
  @IsOptional()
  @IsInt()
  cityId?: number;

  @ApiPropertyOptional({ example: 'Jl. Sudirman No. 123' })
  @IsOptional()
  @IsString()
  fullAddress?: string;

  @ApiPropertyOptional({ example: 'Rumah pojokan' })
  @IsOptional()
  @IsString()
  addressDetail?: string;
}