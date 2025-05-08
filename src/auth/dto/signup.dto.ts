import { IsEnum, IsOptional } from 'class-validator';
import { SignInDto } from './signin.dto';

export class SignUpDto extends SignInDto {
	@IsOptional()
	@IsEnum(['USER', 'ADMIN'], {
		message: 'Valid role required.',
	})
	role: 'USER' | 'ADMIN';
}
