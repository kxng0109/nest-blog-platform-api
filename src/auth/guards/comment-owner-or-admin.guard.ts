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
import { RoleType } from 'src/type';

@Injectable()
export class CommentOwnerOrAdminGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest<Request>();
		return this.validate(req);
	}

	async validate(req): Promise<boolean> {
		const user = req.user as {role: RoleType; id: number} | undefined;
		if (!user) throw new UnauthorizedException();

		const commentId: number = Number(req.params.id);
		const comment = await this.prismaService.comment.findUnique({
			where: {
				id: commentId,
			},
			select: {
				authorId: true,
			},
		});

		//Comment doesn't exists
		if (!comment)
			throw new NotFoundException(`Comment with id: ${commentId} not found.`);

		//Not an admin and not the person that made the comment
		if (user.role !== 'ADMIN' && user.id !== comment.authorId) {
			return false;
		}

		//If the user is an admin or the original commenter
		return true;
	}
}
