import { Module } from '@nestjs/common';
import { CateringPlansService } from './catering-plans.service';
import { CateringPlansController } from './catering-plans.controller';

@Module({
  controllers: [CateringPlansController],
  providers: [CateringPlansService],
})
export class CateringPlansModule {}
