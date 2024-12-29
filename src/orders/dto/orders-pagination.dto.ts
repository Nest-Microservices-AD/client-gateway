import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common';

export class OrdersPaginationDto extends PaginationDto {
  @IsString()
  @IsOptional()
  status?: string;
}
