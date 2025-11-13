import { Test, TestingModule } from '@nestjs/testing';
import { AkinatorController } from './akinator.controller';

describe('AkinatorController', () => {
  let controller: AkinatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AkinatorController],
    }).compile();

    controller = module.get<AkinatorController>(AkinatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
