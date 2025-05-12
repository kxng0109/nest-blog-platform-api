import {
	IsIn,
	IsInt,
	IsOptional,
	IsString,
	Max,
	Min
} from 'class-validator';

export class PaginationFilterDto {
	@IsInt()
	@IsOptional()
	@Min(0)
	skip?: number;

	@IsInt()
	@IsOptional()
	@Min(1)
	@Max(100)
	take?: number;

	@IsString()
	@IsOptional()
	search?: string;

	@IsIn(['asc', 'desc'], { message: "Valid values are 'asc' and 'desc'." })
	@IsOptional()
	orderBy?: 'asc' | 'desc';

	@IsInt()
	@IsOptional()
	@Min(1)
	authorId?: number;
}
