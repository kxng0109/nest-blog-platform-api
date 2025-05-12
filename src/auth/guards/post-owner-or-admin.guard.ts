import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostOwnerOrAdminGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest<Request>();
		return this.validateRequest(req);
	}

	private async validateRequest(req) {
		const user = req.user;
		if (!user) throw new UnauthorizedException();
		const postId = Number(req.params.id);

		const { role, id: userID } = user;
		if (!role && !userID) {
			return false;
		}

		//If a user wants to delete all their posts
		if (req.method === "DELETE" && req.path === "/api/posts/"){
			return true;
		}

		const post = await this.prismaService.post.findUnique({
			where: {
				id: postId,
			},
			select: {
				authorId: true,
			},
		});

		if (!post) {
			throw new NotFoundException(`Resource with id: ${postId} not found`);
		}

		if (role !== 'ADMIN' && post.authorId !== userID) return false;

		return true;
	}
}
