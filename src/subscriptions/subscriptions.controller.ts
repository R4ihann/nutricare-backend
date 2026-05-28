import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new subscription (User only)' })
  @ApiResponse({ status: 201, description: 'Subscription created. endDate and totalPrice auto-calculated from plan.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Catering plan not found.' })
  create(@Body() dto: CreateSubscriptionDto, @Request() req: any) {
    return this.subscriptionsService.create(dto, req.user.id);
  }

@Get()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Get subscriptions (User: own only, Admin: all, paginated)' })
@ApiResponse({ status: 200, description: 'Paginated list of subscriptions based on role.' })
@ApiResponse({ status: 401, description: 'Unauthorized.' })
findAll(
  @Request() req: any,
  @Query('page') page?: string,
  @Query('limit') limit?: string,
) {
  const pageNum = page ? parseInt(page, 10) : 1;
  const limitNum = limit ? parseInt(limit, 10) : 10;
  return this.subscriptionsService.findAll(req.user.id, req.user.role, pageNum, limitNum);
}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single subscription by ID (User: own only, Admin: any)' })
  @ApiParam({ name: 'id', description: 'Subscription ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Subscription found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot view other user subscriptions.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.subscriptionsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update subscription status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Subscription ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Subscription successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubscriptionDto) {
    return this.subscriptionsService.update(id, dto, 0, Role.ADMIN);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a subscription (Admin only)' })
  @ApiParam({ name: 'id', description: 'Subscription ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Subscription successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionsService.remove(id, 0, Role.ADMIN);
  }
}