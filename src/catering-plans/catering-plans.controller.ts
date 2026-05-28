import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CateringPlansService } from './catering-plans.service';
import { CreateCateringPlanDto } from './dto/create-catering-plan.dto';
import { UpdateCateringPlanDto } from './dto/update-catering-plan.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Catering Plans')
@Controller('catering-plans')
export class CateringPlansController {
  mealsService: any;
  constructor(private readonly cateringPlansService: CateringPlansService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new catering plan (Admin only)' })
  @ApiResponse({ status: 201, description: 'Catering plan successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  create(@Body() dto: CreateCateringPlanDto) {
    return this.cateringPlansService.create(dto);
  }
  @Get()
  @ApiOperation({ summary: 'Get all meals' })
  @ApiResponse({ status: 200, description: 'List of all meals.' })
  findAll() {
    return this.mealsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single catering plan by ID' })
  @ApiParam({ name: 'id', description: 'Catering Plan ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Catering plan found.' })
  @ApiResponse({ status: 404, description: 'Catering plan not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cateringPlansService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a catering plan (Admin only)' })
  @ApiParam({ name: 'id', description: 'Catering Plan ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Catering plan successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'Catering plan not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCateringPlanDto) {
    return this.cateringPlansService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a catering plan (Admin only)' })
  @ApiParam({ name: 'id', description: 'Catering Plan ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Catering plan successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'Catering plan not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cateringPlansService.remove(id);
  }
}