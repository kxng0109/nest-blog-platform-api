import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
	(data: string, ctx: ExecutionContext) => {
		const request: Request = ctx.switchToHttp().getRequest();
		const user = request.user;
		if(!user) return null;
		if(!data) return user;
		return user[data];
	},
);
