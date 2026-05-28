import { Test, TestingModule } from '@nestjs/testing';
import { CateringPlansService } from './catering-plans.service';

describe('CateringPlansService', () => {
  let service: CateringPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CateringPlansService],
    }).compile();

    service = module.get<CateringPlansService>(CateringPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
