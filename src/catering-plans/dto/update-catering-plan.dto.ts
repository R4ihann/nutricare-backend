import { PartialType } from '@nestjs/swagger';
import { CreateCateringPlanDto } from './create-catering-plan.dto';

export class UpdateCateringPlanDto extends PartialType(CreateCateringPlanDto) {}
