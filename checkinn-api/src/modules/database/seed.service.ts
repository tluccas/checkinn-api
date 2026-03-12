import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/entities/user.entity.js';
import { Hotel } from '../hotels/entities/hotel.entity.js';
import { Reservation } from '../reservations/entities/reservation.entity.js';
import { Guest } from '../guests/entities/guest.entity.js';
import { ReservationStatus } from '../reservations/enums/status.enum.js';
import { DocumentType } from '../guests/enums/document-type.enum.js';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
    await this.seedHotelReservationAndGuests();
  }

  private async seedAdminUser() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingAdmin = await queryRunner.manager.findOne(User, {
        where: { username: 'admin' },
      });

      if (existingAdmin) {
        this.logger.log('Usuário admin já existe, seed ignorado');
        await queryRunner.rollbackTransaction();
        return;
      }

      const hashedPassword = await bcrypt.hash('123456', 10);

      const admin = queryRunner.manager.create(User, {
        username: 'admin',
        password: hashedPassword,
        isActive: true,
      });

      await queryRunner.manager.save(admin);
      await queryRunner.commitTransaction();

      this.logger.log(
        '[SEEDER] Usuário admin criado com sucesso (admin/123456)',
      );
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        '[SEEDER] Erro ao criar usuário admin:',
        (error as Error).message,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async seedHotelReservationAndGuests() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingHotelCount = await queryRunner.manager.count(Hotel);

      if (existingHotelCount > 0) {
        this.logger.log(
          '[SEEDER] Hotéis já existentes, seed de hotel/reserva/hóspedes ignorado',
        );
        await queryRunner.rollbackTransaction();
        return;
      }

      const hotel = queryRunner.manager.create(Hotel, {
        name: 'Hotel Praia de Ponta Negra',
        city: 'Natal',
        state: 'RN',
        address: 'Av. Engenheiro Teste, xxxx - Ponta Negra',
        totalRooms: 100,
        starsRating: 4,
        description:
          'Hotel à beira-mar em Natal/RN, próximo à Praia de Ponta Negra.',
        phone: '(84) 1000-0000',
        email: 'hotel1@example.com',
        isActive: true,
      });

      await queryRunner.manager.save(hotel);

      const today = new Date();
      const checkIn = new Date(today);
      checkIn.setDate(today.getDate() + 7);
      const checkOut = new Date(today);
      checkOut.setDate(today.getDate() + 10);

      const reservation = queryRunner.manager.create(Reservation, {
        hotel,
        hotelId: hotel.id,
        checkInDate: checkIn.toISOString().slice(0, 10),
        checkOutDate: checkOut.toISOString().slice(0, 10),
        responsibleName: 'João da Silva',
        responsibleEmail: 'joao.silva@example.com',
        responsiblePhone: '(84) 00000-0000',
        roomCount: 2,
        status: ReservationStatus.CONFIRMED,
        notes: 'Reserva criada automaticamente pelo seeder inicial.',
      });

      await queryRunner.manager.save(reservation);

      const guest1 = queryRunner.manager.create(Guest, {
        name: 'João da Silva',
        document: '123.456.789-00',
        documentType: DocumentType.CPF,
        email: 'joao.silva@example.com',
        phone: '(84) 98888-0000',
        reservation,
        reservationId: reservation.id,
      });

      const guest2 = queryRunner.manager.create(Guest, {
        name: 'Maria Souza',
        document: '987.654.321-00',
        documentType: DocumentType.CPF,
        email: 'maria.souza@example.com',
        phone: '(84) 97777-0000',
        reservation,
        reservationId: reservation.id,
      });

      await queryRunner.manager.save([guest1, guest2]);

      await queryRunner.commitTransaction();

      this.logger.log(
        '[SEEDER] Hotel em RN, uma reserva e hóspedes criados com sucesso',
      );
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        '[SEEDER] Erro ao criar hotel/reserva/hóspedes:',
        (error as Error).message,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
