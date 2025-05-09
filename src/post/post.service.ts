import { Injectable, UseFilters } from '@nestjs/common';
import { Post, Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@UseFilters()
@Injectable()
export class PostService {
	constructor(private readonly prismaService: PrismaService) {}

	async createPost(data: Prisma.PostCreateInput) {
		return this.prismaService.post.create({
			data,
		});
	}

	async getAllPosts(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.PostWhereUniqueInput;
		where?: Prisma.PostWhereInput;
		orderBy?: Prisma.PostOrderByWithRelationInput;
	}) {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prismaService.post.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async getPost(where: Prisma.PostWhereUniqueInput): Promise<Post | null> {
		return this.prismaService.post.findUnique({
			where,
		});
	}

	async updatePost(
		where: Prisma.PostWhereUniqueInput,
		data: Prisma.PostUpdateInput,
	) {
		if(!data) return this.getPost(where);
		return this.prismaService.post.update({
			where,
			data,
		});
	}

	async deleteAllPosts(authorId: number) {
		return this.prismaService.post.deleteMany({
			where: {
				authorId
			},
		});
	}

	async deletePost(postId: number) {
		return this.prismaService.post.delete({
			where: {
				id: postId,
			},
		});
	}
}
