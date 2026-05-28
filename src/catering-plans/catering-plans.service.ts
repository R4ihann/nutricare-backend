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

async findAll() {
  return this.prisma.cateringPlan.findMany({   // ✅ FIXED
    where: { isActive: true },
    include: { category: true, meals: true },
  });
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