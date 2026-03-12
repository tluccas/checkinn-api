import { DocumentType } from '../enums/document-type.enum';

export class GuestResponseDto {
  id: string;
  name: string;
  document: string;
  documentType: DocumentType;
  email: string;
  phone: string;
  reservationId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<GuestResponseDto>) {
    Object.assign(this, partial);
  }
}
