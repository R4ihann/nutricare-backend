import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, address: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: number, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, name: true, role: true, address: true, createdAt: true },
    });
  }
}