import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
