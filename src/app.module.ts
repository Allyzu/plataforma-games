import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AkinatorModule } from './akinator/akinator.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [AuthModule, UserModule, DatabaseModule, AkinatorModule, OpenaiModule],
})
export class AppModule {}
