import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async findAllProvinces() {
    return this.prisma.province.findMany({
      include: { cities: true },
    });
  }

  async findCitiesByProvince(provinceId: number) {
    return this.prisma.city.findMany({
      where: { provinceId },
    });
  }
}