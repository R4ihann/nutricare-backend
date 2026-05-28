import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSubscriptionDto, userId: number) {
    // 1. Find the plan to get price and duration
    const plan = await this.prisma.cateringPlan.findUnique({
      where: { id: dto.cateringPlanId },
    });
    if (!plan) throw new NotFoundException('Catering plan not found');

    // 2. Calculate endDate
    const startDate = new Date(dto.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    // 3. Create subscription with auto-calculated fields
    return this.prisma.subscription.create({
      data: {
        userId,
        cateringPlanId: dto.cateringPlanId,
        startDate,
        endDate,
        totalPrice: plan.price,
        orderStatus: 'PENDING',
        paymentStatus: 'UNPAID',
      },
      include: { user: true, cateringPlan: true },
    });
  }

  async findAll(userId: number, userRole: string) {
    // Admin sees all, user sees only their own
    const where = userRole === 'ADMIN' ? {} : { userId };
    return this.prisma.subscription.findMany({
      where,
      include: { user: true, cateringPlan: true },
    });
  }

  async findOne(id: number, userId: number, userRole: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
      include: { user: true, cateringPlan: true },
    });
    if (!subscription) throw new NotFoundException(`Subscription #${id} not found`);
    
    // Users can only see their own
    if (userRole !== 'ADMIN' && subscription.userId !== userId) {
      throw new ForbiddenException('You can only view your own subscriptions');
    }
    return subscription;
  }

  async update(id: number, dto: UpdateSubscriptionDto, userId: number, userRole: string) {
    const subscription = await this.findOne(id, userId, userRole);
    
    // Only admin can update status fields, users can't update their own subscriptions
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update subscriptions');
    }

    return this.prisma.subscription.update({
      where: { id },
      data: dto,
      include: { user: true, cateringPlan: true },
    });
  }

  async remove(id: number, userId: number, userRole: string) {
    await this.findOne(id, userId, userRole);
    
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete subscriptions');
    }

    return this.prisma.subscription.delete({ where: { id } });
  }
}