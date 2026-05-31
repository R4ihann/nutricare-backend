import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
      include: { cateringPlans: true },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: { cateringPlans: true },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { cateringPlans: true },
    });
    if (!category) throw new NotFoundException(`Category #${id} not found`);
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({
      where: { id },
      data: dto,
      include: { cateringPlans: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    
    // NEW: Check if any plans use this category
    const plansCount = await this.prisma.cateringPlan.count({
      where: { categoryId: id },
    });
    if (plansCount > 0) {
      throw new BadRequestException(
        `Cannot delete category - ${plansCount} plan(s) still use it`
      );
    }

    return this.prisma.category.delete({ where: { id } });
  }
}