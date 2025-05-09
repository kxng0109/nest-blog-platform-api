import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
	imports: [
		PrismaModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			global: true,
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
				},
			}),
			inject: [ConfigService],
		}),
	],
	providers: [AuthService, JwtStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
