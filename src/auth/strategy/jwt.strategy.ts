import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(
		configService: ConfigService,
		private readonly prismaService: PrismaService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET')!,
		});
	}

	async validate(payload: { sub: number; email: string }) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: payload.sub,
			},
			omit: {
				password: false,
			},
		});

		return user;
	}
}
