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
    Query,
    UseGuards,
} from '@nestjs/common';
import { Comment as CommentModel, Post as PostModel } from 'generated/prisma';
import { User } from 'src/auth/decorator';
import { JwtAuthGuard, PostOwnerOrAdminGuard } from 'src/auth/guards/';
import { CommentsService } from 'src/comments/comments.service';
import { CreateCommentDto } from 'src/comments/dto/';
import { CreatePostDto, PaginationFilterDto, UpdatePostDto } from './dto';
import { PostService } from './post.service';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
	constructor(
		private readonly postService: PostService,
		private readonly commentsService: CommentsService,
	) {}

	//Create a post
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

	//Create a comment under a post with id of "id"
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

	//Get all posts from every user or a particular user
	@Get()
	async getAllPosts(
		@Query() query: PaginationFilterDto,
	): Promise<PostModel[]> {
		return await this.postService.getAllPosts(query);
	}

	//Get a post by its id
	@Get(':id')
	async getPost(
		@Param('id', ParseIntPipe) id: number,
	): Promise<PostModel | null> {
		return await this.postService.getPost({ id });
	}

	//Get all the comments under a post
	@Get(':id/comments')
	async getAllPostComments(
		@Param('id', ParseIntPipe) id: number,
	): Promise<CommentModel[] | null> {
		return await this.commentsService.getAllPostComments(id);
	}

	//Update a post
	@UseGuards(PostOwnerOrAdminGuard)
	@Patch(':id')
	async updatePost(
		@Param('id', ParseIntPipe) id: number,
		@Body() updatePostDto: UpdatePostDto,
	): Promise<PostModel | null> {
		return await this.postService.updatePost({ id }, updatePostDto);
	}

	//Delete all posts from the user
	@UseGuards(PostOwnerOrAdminGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete()
	async deleteAllPosts(@User('id') authorId: number) {
		return await this.postService.deleteAllPosts(authorId);
	}

	//Delete a post of id, "id"
	@UseGuards(PostOwnerOrAdminGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async deletePost(@Param('id', ParseIntPipe) id: number) {
		return await this.postService.deletePost(id);
	}
}
