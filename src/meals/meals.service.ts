import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

@Injectable()
export class MealsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMealDto) {
    return this.prisma.meal.create({
      data: dto,
      include: { cateringPlan: true },
    });
  }

async findAll() {
  return this.prisma.meal.findMany({
    include: { cateringPlan: true },
  });
}
  async findOne(id: number) {
    const meal = await this.prisma.meal.findUnique({
      where: { id },
      include: { cateringPlan: true },
    });
    if (!meal) throw new NotFoundException(`Meal #${id} not found`);
    return meal;
  }

  async update(id: number, dto: UpdateMealDto) {
    await this.findOne(id);
    return this.prisma.meal.update({
      where: { id },
      data: dto,
      include: { cateringPlan: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.meal.delete({ where: { id } });
  }
}