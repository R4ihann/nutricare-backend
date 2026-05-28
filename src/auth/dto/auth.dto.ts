import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 1, description: 'City ID', required: false })
  @IsInt()
  @IsOptional()
  cityId?: number;

  @ApiProperty({ example: 'Jl. Sudirman No. 123', required: false })
  @IsString()
  @IsOptional()
  fullAddress?: string;

  @ApiProperty({ example: 'Rumah pojokan', required: false })
  @IsString()
  @IsOptional()
  addressDetail?: string;

  @ApiProperty({ example: 'USER', required: false, enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
  address: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}