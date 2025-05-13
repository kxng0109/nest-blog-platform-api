import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { Comment as CommentModel } from 'generated/prisma';
import { User } from 'src/auth/decorator';
import { CommentOwnerOrAdminGuard, JwtAuthGuard } from 'src/auth/guards';
import { RoleType } from 'src/type';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/';

@UseGuards(JwtAuthGuard, CommentOwnerOrAdminGuard)
@Controller('comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Patch(':id')
	async editComment(
		@User('id') userId: number,
		@User('role') role: RoleType,
		@Param('id', ParseIntPipe) id: number,
		@Body() updateCommentDto: UpdateCommentDto,
	): Promise<CommentModel> {
		return await this.commentsService.editComment({
			id,
			userId,
			data: updateCommentDto,
			role,
		});
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async deleteComment(
		@User('id') userId: number,
		@User('role') role: RoleType,
		@Param('id', ParseIntPipe) id: number,
	) {
		return await this.commentsService.deleteComment({
			userId,
			id,
			role,
		});
	}
}
