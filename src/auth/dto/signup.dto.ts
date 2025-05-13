import { IsEnum, IsOptional } from 'class-validator';
import { RoleType } from 'src/type';
import { SignInDto } from './signin.dto';

export class SignUpDto extends SignInDto {
	@IsOptional()
	@IsEnum(['USER', 'ADMIN'], {
		message: 'Valid role required.',
	})
	role: RoleType;
}
