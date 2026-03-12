import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReservationStatus } from '../enums/status.enum.js';

export class UpdateReservationStatusDto {
  @IsNotEmpty({ message: 'O status é obrigatório' })
  @IsEnum(ReservationStatus, {
    message: `Status deve ser um dos valores: ${Object.values(ReservationStatus).join(', ')}`,
  })
  status: ReservationStatus;
}
