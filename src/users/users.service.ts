import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}

	async getMe(where: Prisma.UserWhereUniqueInput) {
		return await this.prismaService.user.findUnique({
			where,
			omit: {
				password: true,
			},
		});
	}
}
