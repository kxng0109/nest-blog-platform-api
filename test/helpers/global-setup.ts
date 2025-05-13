import * as argon from "argon2";
import { config } from 'dotenv';
import { PrismaClient } from '../../generated/prisma';
import { SignUpDto } from '../../src/auth/dto';

export default async () => {
	config({ path: '.env.test' });

	const authDto: SignUpDto = {
		email: 'test@test.com',
		password: await argon.hash("r@ndom123"),
		role: 'USER',
	};

	const prisma = new PrismaClient();
	await prisma.$connect();

	try {
		await prisma.user.create({
			data: { ...authDto },
		});
	} catch (err) {
		throw err;
	}
	await prisma.$disconnect();
};
