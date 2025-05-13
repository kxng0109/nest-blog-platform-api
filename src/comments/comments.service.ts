import { Injectable } from '@nestjs/common';
import { Comment, Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleType } from 'src/type';

@Injectable()
export class CommentsService {
	constructor(private readonly prismaService: PrismaService) {}

	async createComment(data: Prisma.CommentCreateInput): Promise<Comment> {
		return await this.prismaService.comment.create({ data });
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
		role: RoleType;
	}): Promise<Comment> {
		const { id, userId, data, role } = params;
		const whereClause = role === 'ADMIN' ? { id } : { id, authorId: userId };

		return await this.prismaService.comment.update({
			where: whereClause,
			data,
		});
	}

	async deleteComment(params: { id: number; userId: number; role: RoleType }) {
		const { id, userId, role } = params;
		const whereClause = role === 'ADMIN' ? { id } : { id, authorId: userId };

		return await this.prismaService.comment.delete({
			where: whereClause,
		});
	}
}
