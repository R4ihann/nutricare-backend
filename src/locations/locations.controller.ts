import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationsService } from './locations.service';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('provinces')
  @ApiOperation({ summary: 'Get all provinces with their cities' })
  @ApiResponse({ status: 200, description: 'List of all provinces.' })
  findAllProvinces() {
    return this.locationsService.findAllProvinces();
  }

  @Get('provinces/:id/cities')
  @ApiOperation({ summary: 'Get all cities in a province' })
  @ApiParam({ name: 'id', description: 'Province ID', example: 1 })
  @ApiResponse({ status: 200, description: 'List of cities in the province.' })
  findCitiesByProvince(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.findCitiesByProvince(id);
  }
}