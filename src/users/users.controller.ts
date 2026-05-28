import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }
}