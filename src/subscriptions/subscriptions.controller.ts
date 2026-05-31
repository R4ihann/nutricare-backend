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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateOrderStatusDto, UpdatePaymentStatusDto } from './dto/update-status.dto';
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
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid plan or duration.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() dto: CreateSubscriptionDto, @Request() req: any) {
    return this.subscriptionsService.create(dto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscriptions (User: own only, Admin: all)' })
  @ApiResponse({ status: 200, description: 'List of subscriptions.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Request() req: any) {
    return this.subscriptionsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single subscription by ID' })
  @ApiParam({ name: 'id', description: 'Subscription ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Subscription found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.subscriptionsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update subscription order status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Subscription ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Order status updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.subscriptionsService.updateOrderStatus(id, dto.orderStatus);
  }

  @Patch(':id/payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update subscription payment status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Subscription ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Payment status updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  updatePaymentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.subscriptionsService.updatePaymentStatus(id, dto.paymentStatus);
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
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.subscriptionsService.remove(id, req.user.id, req.user.role);
  }
}