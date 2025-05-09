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
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { Post as PostModel } from 'generated/prisma';
import { User } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PostOwnerOrAdminGuard } from 'src/auth/guards/post-owner-or-admin.guard';
import { PrismaClientExceptionFilter } from 'src/PrismaClientException.filter';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostService } from './post.service';

@UseFilters(PrismaClientExceptionFilter)
@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

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
	@Delete(":id")
	async deletePost(@Param("id", ParseIntPipe) id:number){
		return await this.postService.deletePost(id)
	}
}
