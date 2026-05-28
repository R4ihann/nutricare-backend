import { Test, TestingModule } from '@nestjs/testing';
import { CateringPlansController } from './catering-plans.controller';
import { CateringPlansService } from './catering-plans.service';

describe('CateringPlansController', () => {
  let controller: CateringPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CateringPlansController],
      providers: [CateringPlansService],
    }).compile();

    controller = module.get<CateringPlansController>(CateringPlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
