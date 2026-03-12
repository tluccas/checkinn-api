export type DocumentType = "CPF" | "PASSPORT";

export interface Guest {
  id: string;
  name: string;
  document: string;
  documentType: DocumentType;
  email: string;
  phone: string;
  reservationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuestRequest {
  name: string;
  document: string;
  documentType?: DocumentType;
  reservationId: string;
  email?: string;
  phone?: string;
}

export interface UpdateGuestRequest {
  name?: string;
  document?: string;
  documentType?: DocumentType;
  email?: string;
  phone?: string;
}
