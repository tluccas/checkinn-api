import {
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class UpdateHotelRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsInt({ message: 'A quantidade de quartos deve ser um número inteiro' })
  @Min(1, { message: 'O hotel deve ter pelo menos 1 quarto' })
  totalRooms?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  starsRating?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
