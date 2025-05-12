import { Injectable } from '@nestjs/common';
import { Post, Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationFilterDto } from './dto';

type FindPostParams = PaginationFilterDto & {
	where?: Prisma.PostWhereInput;
	cursor?: Prisma.PostWhereUniqueInput;
};

@Injectable()
export class PostService {
	constructor(private readonly prismaService: PrismaService) {}

	async createPost(data: Prisma.PostCreateInput) {
		return this.prismaService.post.create({
			data,
		});
	}

	/**
	 *
	 * Get all posts from the database
	 *
	 * @param params An object that implemets the custom FIndPostParams type and
	 * contains skip, take, orderBy, search, cursor and where, which are all optional
	 *
	 * @returns Filtered posts or an empty array if no posts with such filters are found
	 */

	async getAllPosts(params: FindPostParams) {
		const { skip, take, orderBy, search, cursor, authorId } = params;
		let { where } = params;
		where = authorId ? { ...where, authorId } : where;

		const whereClause: Prisma.PostWhereInput = {
			...where,
			...(search
				? {
						OR: [
							{
								title: {
									contains: search,
									mode: 'insensitive',
								},
							},
							{
								content: {
									contains: search,
									mode: 'insensitive',
								},
							},
						],
					}
				: {}),
		};

		return this.prismaService.post.findMany({
			skip,
			take,
			cursor,
			where: whereClause,
			orderBy: { createdAt: orderBy || 'desc' },
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
		if (!data) return this.getPost(where);
		return this.prismaService.post.update({
			where,
			data,
		});
	}

	async deleteAllPosts(authorId: number) {
		return this.prismaService.post.deleteMany({
			where: {
				authorId,
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
