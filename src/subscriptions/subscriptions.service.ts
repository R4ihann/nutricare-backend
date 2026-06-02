import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { Parser } from 'json2csv';


@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateSubscriptionDto, userId: number) {
    const plan = await this.prisma.cateringPlan.findUnique({
      where: { id: dto.cateringPlanId },
    });
    if (!plan) throw new NotFoundException('Catering plan not found');

    // NEW: Check for existing active subscription to this plan
    const existingSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        cateringPlanId: dto.cateringPlanId,
        orderStatus: {
          not: 'DONE', // not completed yet
        },
      },
    });

    if (existingSubscription) {
      throw new BadRequestException(
        'You already have an active subscription to this plan'
      );
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    const totalPrice = plan.price;

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
      include: {
        user: {
          select: { id: true, email: true, role: true },
        },
        cateringPlan: true,
      },
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

  async exportSubscriptions() {
    const subscriptions = await this.prisma.subscription.findMany({
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
        cateringPlan: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const fields = [
      { label: 'ID', value: 'id' },
      { label: 'Customer Email', value: 'user.email' },
      { label: 'Customer Name', value: 'user.name' },
      { label: 'Plan Name', value: 'cateringPlan.name' },
      { label: 'Category', value: 'cateringPlan.category.name' },
      { label: 'Duration (Days)', value: 'cateringPlan.duration' },
      { label: 'Total Price', value: 'totalPrice' },
      { label: 'Order Status', value: 'orderStatus' },
      { label: 'Payment Status', value: 'paymentStatus' },
      { label: 'Start Date', value: 'startDate' },
      { label: 'End Date', value: 'endDate' },
      { label: 'Created At', value: 'createdAt' },
    ];

    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(subscriptions);

    return csv;
  }
}