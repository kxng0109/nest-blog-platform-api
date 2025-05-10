import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    ForbiddenException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(ForbiddenException)
export class ForbiddenFilter implements ExceptionFilter {
	catch(exception: ForbiddenException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse<Response>();
		const statusCode = exception.getStatus() || HttpStatus.FORBIDDEN;

		res.status(statusCode).json({
			message: 'You do not have sufficient permission to perform this action.',
			error: 'Forbidden',
			statusCode,
		});
	}
}
