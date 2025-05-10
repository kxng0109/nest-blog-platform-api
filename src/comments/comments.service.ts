import { Injectable } from '@nestjs/common';
import { Comment, Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
	constructor(private readonly prismaService: PrismaService) {}

	async createComment(data: Prisma.CommentCreateInput): Promise<Comment> {
		return await this.prismaService.comment.create({data});
	}

	async getAllPostComments(postId: number): Promise<Comment[] | null> {
		return await this.prismaService.comment.findMany({
			where: {
				postId,
			},
		});
	}

	async editComment(params: {
		id: number;
		userId: number;
		data: Prisma.CommentUpdateInput;
	}): Promise<Comment> {
		const { id, userId, data } = params;
		return await this.prismaService.comment.update({
			where: {
				id,
				authorId: userId,
			},
			data,
		});
	}

	async deleteComment(params: {
		id: number;
		userId: number;
	}) {
		const { id, userId } = params;
		return await this.prismaService.comment.delete({
			where: {
				id,
			},
		});
	}
}
