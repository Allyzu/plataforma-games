import { Module } from '@nestjs/common';
import { AkinatorController } from './akinator.controller';

@Module({
  providers: [],
  controllers: [AkinatorController]
})
export class AkinatorModule {}
