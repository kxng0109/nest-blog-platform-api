import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PostModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
