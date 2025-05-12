import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Post as PostModel } from 'generated/prisma';
import { User } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guards';
import { PostService } from 'src/post/post.service';

@Controller('users')
export class UsersController {
	constructor(
		private readonly postService: PostService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Get('me/posts')
	async getMyPosts(@User('id') myId: number): Promise<PostModel[]> {
		return await this.postService.getAllPosts({
			where: {
				authorId: myId,
			},
		});
	}

	@Get(':authorId/posts')
	async getUserPosts(
		@Param('authorId', ParseIntPipe) authorId: number,
	): Promise<PostModel[]> {
		return await this.postService.getAllPosts({
			where: { authorId },
		});
	}
}
