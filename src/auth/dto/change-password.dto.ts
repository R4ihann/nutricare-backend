import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123' })
  @IsString()
  oldPassword!: string;

  @ApiProperty({ example: 'newpassword456' })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}