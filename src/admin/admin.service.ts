import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [users, plans, subscriptions, revenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.cateringPlan.count(),
      this.prisma.subscription.count(),
      this.prisma.subscription.aggregate({
        _sum: { totalPrice: true },
      }),
    ]);

    return {
      users,
      plans,
      subscriptions,
      revenue: revenue._sum.totalPrice || 0,
    };
  }
}