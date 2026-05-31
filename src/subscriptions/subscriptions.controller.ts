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
  create(@Body() dto: CreateSubscriptionDto, @Request() req: any) {
    return this.subscriptionsService.create(dto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscriptions (User: own only, Admin: all)' })
  findAll(@Request() req: any) {
    return this.subscriptionsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single subscription by ID' })
  @ApiParam({ name: 'id', description: 'Subscription ID', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.subscriptionsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update subscription order status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Subscription ID', example: 1 })
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
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.subscriptionsService.remove(id, req.user.id, req.user.role);
  }
}