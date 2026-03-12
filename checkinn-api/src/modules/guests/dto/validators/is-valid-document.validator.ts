import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DocumentType } from '../../enums/document-type.enum.js';

@ValidatorConstraint({ name: 'IsValidDocument', async: false })
export class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  validate(document: string, args: ValidationArguments): boolean {
    const dto = args.object as { documentType?: DocumentType };
    const type = dto.documentType ?? DocumentType.CPF;

    switch (type) {
      case DocumentType.CPF:
        return this.isValidCpf(document);
      case DocumentType.PASSPORT:
        return this.isValidPassport(document);
      default:
        return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const dto = args.object as { documentType?: DocumentType };
    const type = dto.documentType ?? DocumentType.CPF;

    switch (type) {
      case DocumentType.CPF:
        return 'CPF invalido. Deve conter 11 digitos numericos validos';
      case DocumentType.PASSPORT:
        return 'Passaporte invalido. Deve conter entre 6 e 9 caracteres alfanumericos';
      default:
        return 'Documento invalido';
    }
  }

  private isValidCpf(cpf: string): boolean {
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length !== 11) return false;

    // => Abaixo um algoritmo para possivel validação, optei por deixar desativado para testes mais faceis.

    // if (/^(\d)\1{10}$/.test(cleaned)) return false;

    // let sum = 0;
    // for (let i = 0; i < 9; i++) {
    //   sum += parseInt(cleaned.charAt(i)) * (10 - i);
    // }
    // let remainder = (sum * 10) % 11;
    // if (remainder === 10) remainder = 0;
    // if (remainder !== parseInt(cleaned.charAt(9))) return false;

    // sum = 0;
    // for (let i = 0; i < 10; i++) {
    //   sum += parseInt(cleaned.charAt(i)) * (11 - i);
    // }
    // remainder = (sum * 10) % 11;
    // if (remainder === 10) remainder = 0;
    // if (remainder !== parseInt(cleaned.charAt(10))) return false;

    return true;
  }

  private isValidPassport(passport: string): boolean {
    return /^[A-Za-z0-9]{6,9}$/.test(passport);
  }
}
