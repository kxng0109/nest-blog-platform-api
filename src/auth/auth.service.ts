import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
	) {}

	async signup(
		data: Prisma.UserCreateInput,
	): Promise<{ access_token: string }> {
		const { email, password, role = 'USER' } = data;
		const user = await this.prismaService.user.findUnique({ where: { email } });
		if (user) {
			throw new BadRequestException('Credentials taken.');
		}

		const newUser = await this.prismaService.user.create({
			data: {
				email,
				password: await this.hashPassword(password),
				role,
			},
			omit: {
				password: true,
			},
		});
		return await this.signJwt({ id: newUser.id, email });
	}

	async signin(signInDto: SignInDto) {
		const { email, password } = signInDto;
		const user = await this.prismaService.user.findUnique({
			where: { email },
		});
		if (!user) {
			throw new BadRequestException('Incorrect credentials.');
		}

		const pwMatch = await this.verifyPassword(user.password, password);
		if (!pwMatch) {
			throw new UnauthorizedException('Incorrect credentials.');
		}

		return await this.signJwt({ id: user.id, email });
	}

	private async hashPassword(plain: string): Promise<string> {
		return await argon.hash(plain);
	}

	private async verifyPassword(hash: string, plain: string): Promise<boolean> {
		try {
			return await argon.verify(hash, plain);
		} catch (err) {
			throw new InternalServerErrorException(err);
		}
	}

	private async signJwt(userDetails: {
		id: number;
		email: string;
	}): Promise<{ access_token: string }> {
		const { id, email } = userDetails;
		const payload = { sub: id, email };

		const access_token = await this.jwtService.signAsync(payload);
		return { access_token };
	}
}
