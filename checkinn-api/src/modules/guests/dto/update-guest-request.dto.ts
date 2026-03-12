import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  Validate,
} from 'class-validator';
import { DocumentType } from '../enums/document-type.enum';
import { IsValidDocumentConstraint } from './validators/is-valid-document.validator';

export class UpdateGuestRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Validate(IsValidDocumentConstraint)
  document?: string;

  @IsOptional()
  @IsEnum(DocumentType, {
    message: 'Tipo de documento deve ser CPF ou PASSPORT',
  })
  documentType?: DocumentType;

  @IsOptional()
  @IsEmail({}, { message: 'Email invalido' })
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
