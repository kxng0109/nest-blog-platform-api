import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common';
import { Comment as CommentModel, Post as PostModel } from 'generated/prisma';
import { User } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard, PostOwnerOrAdminGuard } from 'src/auth/guards/';
import { CommentsService } from 'src/comments/comments.service';
import { CreateCommentDto } from 'src/comments/dto/';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostService } from './post.service';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
	constructor(
		private readonly postService: PostService,
		private readonly commentsService: CommentsService,
	) {}

	@Post()
	async createPost(
		@Body() postDto: CreatePostDto,
		@User('id') authorId: number,
	): Promise<PostModel> {
		return await this.postService.createPost({
			...postDto,
			author: { connect: { id: authorId } },
		});
	}

	@Post(':id/comments')
	async createComment(
		@User('id') userId: number,
		@Param('id', ParseIntPipe) id: number,
		@Body() createCommentDto: CreateCommentDto,
	): Promise<CommentModel> {
		return await this.commentsService.createComment({
			...createCommentDto,
			post: {
				connect: {
					id,
				},
			},
			author: {
				connect: {
					id: userId,
				},
			},
		});
	}

	@Get()
	async getAllPosts(@User('id') authorId: number): Promise<PostModel[]> {
		return await this.postService.getAllPosts({ where: { authorId } });
	}

	@Get(':id')
	async getPost(
		@Param('id', ParseIntPipe) id: number,
	): Promise<PostModel | null> {
		return await this.postService.getPost({ id });
	}

	@Get(':id/comments')
	async getAllPostComments(
		@Param('id', ParseIntPipe) id: number,
	): Promise<CommentModel[] | null> {
		return await this.commentsService.getAllPostComments(id);
	}

	@UseGuards(PostOwnerOrAdminGuard)
	@Patch(':id')
	async updatePost(
		@Param('id', ParseIntPipe) id: number,
		@Body() updatePostDto: UpdatePostDto,
	): Promise<PostModel | null> {
		return await this.postService.updatePost({ id }, updatePostDto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete()
	async deleteAllPosts(@User('id') authorId: number) {
		return await this.postService.deleteAllPosts(authorId);
	}

	@UseGuards(PostOwnerOrAdminGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async deletePost(@Param('id', ParseIntPipe) id: number) {
		return await this.postService.deletePost(id);
	}
}
