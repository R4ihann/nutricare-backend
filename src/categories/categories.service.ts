import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async findAll(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    this.prisma.category.findMany({
      include: { cateringPlans: true },
      skip,
      take: limit,
    }),
    this.prisma.category.count(),
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
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { cateringPlans: true },
    });
    if (!category) throw new NotFoundException(`Category #${id} not found`);
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id); // throws if not found
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // throws if not found
    return this.prisma.category.delete({ where: { id } });
  }
}