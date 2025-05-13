import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Throttle({ short: { ttl: 1000, limit: 1 } })
	@Post('signup')
	signup(@Body() signUpDto: SignUpDto) {
		return this.authService.signup(signUpDto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	signin(@Body() signInDto: SignInDto) {
		return this.authService.signin(signInDto);
	}
}
