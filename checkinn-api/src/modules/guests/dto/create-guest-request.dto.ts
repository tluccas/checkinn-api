import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEmail,
  IsEnum,
  Validate,
} from 'class-validator';
import { DocumentType } from '../enums/document-type.enum';
import { IsValidDocumentConstraint } from './validators/is-valid-document.validator';

export class CreateGuestRequestDto {
  @IsNotEmpty({ message: 'O nome do hospede e obrigatorio' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'O documento e obrigatorio' })
  @IsString()
  @Validate(IsValidDocumentConstraint)
  document: string;

  @IsOptional()
  @IsEnum(DocumentType, {
    message: 'Tipo de documento deve ser CPF ou PASSPORT',
  })
  documentType?: DocumentType;

  @IsNotEmpty({ message: 'A reserva e obrigatoria' })
  @IsUUID('4', { message: 'ID da reserva deve ser um UUID valido' })
  reservationId: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email invalido' })
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
