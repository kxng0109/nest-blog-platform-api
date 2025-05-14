import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { Post as PostModel } from 'generated/prisma';
import { User } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guards';
import { PostService } from 'src/post/post.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(
		private readonly postService: PostService,
		private readonly userService: UsersService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Get('me/posts')
	async getMyPosts(@User('id') myId: number): Promise<PostModel[]> {
		return this.postService.getAllPosts({
			where: {
				authorId: myId,
			},
		});
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async getMe(@User('id') myId: number) {
		return this.userService.getMe({ id: myId });
	}

	@Get(':authorId/posts')
	async getUserPosts(
		@Param('authorId', ParseIntPipe) authorId: number,
	): Promise<PostModel[]> {
		return this.postService.getAllPosts({
			where: { authorId },
		});
	}
}
