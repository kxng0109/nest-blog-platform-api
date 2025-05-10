import {
    Body,
    Controller,
    Delete,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards
} from '@nestjs/common';
import { Comment as CommentModel } from 'generated/prisma';
import { User } from 'src/auth/decorator/user.decorator';
import { CommentOwnerOrAdminGuard, JwtAuthGuard } from 'src/auth/guards';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Patch(':id')
	async editComment(
		@User('id') userId: number,
		@Param('id', ParseIntPipe) id: number,
		@Body() updateCommentDto: UpdateCommentDto,
	): Promise<CommentModel> {
		return await this.commentsService.editComment({
			id,
			userId,
			data: updateCommentDto,
		});
	}

	@UseGuards(CommentOwnerOrAdminGuard) //Admins and the person who made it only
	@Delete(':id')
	async deleteComment(
		@User('id') userId: number,
		@Param('id', ParseIntPipe) id: number,
	) {
		return await this.commentsService.deleteComment({
			userId,
			id
		});
	}
}
