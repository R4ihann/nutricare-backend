import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateSubscriptionDto, userId: number) {
    const plan = await this.prisma.cateringPlan.findUnique({
      where: { id: dto.cateringPlanId },
    });
    if (!plan) throw new NotFoundException('Catering plan not found');

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);  // Use plan's duration!

    const rawPrice = (plan.duration / 7) * plan.price;
    const totalPrice = Math.ceil(rawPrice / 1000) * 1000;

    return this.prisma.subscription.create({
      data: {
        userId,
        cateringPlanId: dto.cateringPlanId,
        startDate,
        endDate,
        totalPrice,
        orderStatus: 'PENDING',
        paymentStatus: 'UNPAID',
      },
      include: { user: true, cateringPlan: true },
    });
  }

  async findAll(userId: number, userRole: string) {
    const where = userRole === 'ADMIN' ? {} : { userId };
    return this.prisma.subscription.findMany({
      where,
      include: { user: true, cateringPlan: true },
    });
  }

  async findOne(id: number, userId: number, userRole: string) {
    const where = userRole === 'ADMIN' ? { id } : { id, userId };
    const subscription = await this.prisma.subscription.findUnique({
      where,
      include: { user: true, cateringPlan: true },
    });
    if (!subscription) throw new NotFoundException(`Subscription #${id} not found`);
    return subscription;
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!subscription) throw new NotFoundException(`Subscription #${id} not found`);

    return this.prisma.subscription.update({
      where: { id },
      data: { orderStatus: status },
      include: { user: true, cateringPlan: true },
    });
  }

  async updatePaymentStatus(id: number, status: PaymentStatus) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!subscription) throw new NotFoundException(`Subscription #${id} not found`);

    return this.prisma.subscription.update({
      where: { id },
      data: { paymentStatus: status },
      include: { user: true, cateringPlan: true },
    });
  }

  async remove(id: number, userId: number, userRole: string) {
    await this.findOne(id, userId, userRole);
    return this.prisma.subscription.delete({ where: { id } });
  }
}