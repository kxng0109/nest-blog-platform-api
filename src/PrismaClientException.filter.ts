import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
	catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const req = ctx.getRequest<Request>();
		const res = ctx.getResponse<Response>();

		if (exception.code === 'P2025') {
			return res.status(HttpStatus.NOT_FOUND).json({
				message: `Cannot ${req.method} ${exception.meta?.modelName} with id:${req.params?.id}`,
				error: exception.meta?.cause || 'Record does not exists.',
				statusCode: HttpStatus.NOT_FOUND,
			});
		}

		res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			path: req.url,
			error: 'Internal database error',
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
		});
	}
}
