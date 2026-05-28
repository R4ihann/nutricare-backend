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
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Meals')
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new meal (Admin only)' })
  @ApiResponse({ status: 201, description: 'Meal successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  create(@Body() dto: CreateMealDto) {
    return this.mealsService.create(dto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get ALL meals (no pagination)' })
  @ApiResponse({ status: 200, description: 'Complete list of all meals.' })
  findAllNoPagination() {
    return this.mealsService.findAllNoPagination();
  }

  @Get()
  @ApiOperation({ summary: 'Get meals (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list of meals.' })
  findAllPaginated(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.mealsService.findAllPaginated(pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single meal by ID' })
  @ApiParam({ name: 'id', description: 'Meal ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Meal found.' })
  @ApiResponse({ status: 404, description: 'Meal not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mealsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a meal (Admin only)' })
  @ApiParam({ name: 'id', description: 'Meal ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Meal successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'Meal not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMealDto) {
    return this.mealsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a meal (Admin only)' })
  @ApiParam({ name: 'id', description: 'Meal ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Meal successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'Meal not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mealsService.remove(id);
  }
}