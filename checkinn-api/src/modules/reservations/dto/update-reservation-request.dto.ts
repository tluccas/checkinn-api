import {
  IsString,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
  IsEmail,
} from 'class-validator';

export class UpdateReservationRequestDto {
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Data de check-in deve estar no formato ISO (YYYY-MM-DD)',
    },
  )
  checkInDate?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Data de check-out deve estar no formato ISO (YYYY-MM-DD)' },
  )
  checkOutDate?: string;

  @IsOptional()
  @IsString()
  responsibleName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email do responsavel invalido' })
  responsibleEmail?: string;

  @IsOptional()
  @IsString()
  responsiblePhone?: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'A reserva deve ter pelo menos 1 quarto' })
  roomCount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
