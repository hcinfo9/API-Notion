import { Module } from '@nestjs/common';
import { NotionService } from './notion.service';
import { NotionController } from './notion.controller';
import { RedisModule } from 'src/redis/redis.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [RedisModule, AuthModule],
  controllers: [NotionController],
  providers: [NotionService],
})
export class NotionModule {}
