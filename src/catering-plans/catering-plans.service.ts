import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCateringPlanDto } from './dto/create-catering-plan.dto';
import { UpdateCateringPlanDto } from './dto/update-catering-plan.dto';

@Injectable()
export class CateringPlansService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCateringPlanDto) {
    return this.prisma.cateringPlan.create({
      data: dto,
      include: { category: true, meals: true },
    });
  }

  async findAllNoPagination(search?: string, categoryId?: number) {
    const where: any = { isActive: true };
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }

    return this.prisma.cateringPlan.findMany({
      where,
      include: { category: true, meals: true },
    });
  }

  async findAllPaginated(page: number = 1, limit: number = 10, search?: string, categoryId?: number) {
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [data, total] = await Promise.all([
      this.prisma.cateringPlan.findMany({
        where,
        include: { category: true, meals: true },
        skip,
        take: limit,
      }),
      this.prisma.cateringPlan.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const plan = await this.prisma.cateringPlan.findUnique({
      where: { id },
      include: { category: true, meals: true },
    });
    if (!plan) throw new NotFoundException(`Catering plan #${id} not found`);
    return plan;
  }

  async update(id: number, dto: UpdateCateringPlanDto) {
    await this.findOne(id);
    return this.prisma.cateringPlan.update({
      where: { id },
      data: dto,
      include: { category: true, meals: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cateringPlan.delete({ where: { id } });
  }
}