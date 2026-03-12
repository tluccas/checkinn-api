import {
  Injectable,
  NotFoundException,
  Logger,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Hotel } from './entities/hotel.entity.js';
import { CreateHotelRequestDto } from './dto/create-hotel-request.dto.js';
import { UpdateHotelRequestDto } from './dto/update-hotel-request.dto.js';
import { HotelResponseDto } from './dto/hotel-response.dto.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';

const HOTELS_CACHE_PREFIX = 'hotels:';
const HOTELS_CACHE_TTL = 5 * 60 * 1000; // 5 minutos

@Injectable()
export class HotelsService {
  private readonly logger = new Logger(HotelsService.name);
  private readonly activeCacheKeys = new Set<string>();

  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateHotelRequestDto): Promise<HotelResponseDto> {
    try {
      const hotel = this.hotelRepository.create(dto);
      const saved = await this.hotelRepository.save(hotel);
      this.logger.log(`Hotel criado: ${saved.name} (${saved.id})`);

      await this.invalidateCache();

      return this.toResponseDto(saved);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Já existe um hotel cadastrado com estes dados.',
          );
        }
      }
      this.logger.error('Erro inesperado ao salvar hotel', error);
      throw error;
    }
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<HotelResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const cacheKey = `${HOTELS_CACHE_PREFIX}page:${page}:limit:${limit}`;

    const cached =
      await this.cacheManager.get<PaginatedResponseDto<HotelResponseDto>>(
        cacheKey,
      );
    if (cached) {
      this.logger.debug('Cache Hit: Hoteis encontrados no cache');
      return cached;
    }

    const [hotels, totalItems] = await this.hotelRepository.findAndCount({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = hotels.map((hotel) => this.toResponseDto(hotel));
    const result = new PaginatedResponseDto(data, totalItems, page, limit);

    await this.cacheManager.set(cacheKey, result, HOTELS_CACHE_TTL);
    this.activeCacheKeys.add(cacheKey);
    this.logger.debug('Cache Miss: Hoteis armazenados no cache');

    return result;
  }

  async findById(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({
      where: { id, isActive: true },
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel com ID ${id} nao encontrado`);
    }

    return hotel;
  }

  async update(
    id: string,
    dto: UpdateHotelRequestDto,
  ): Promise<HotelResponseDto> {
    const hotel = await this.findById(id);

    Object.assign(hotel, dto);

    try {
      const updated = await this.hotelRepository.save(hotel);
      this.logger.log(`Hotel atualizado: ${updated.name} (${updated.id})`);

      await this.invalidateCache();

      return this.toResponseDto(updated);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === '23505') {
          throw new ConflictException(
            'Já existe um hotel cadastrado com estes dados.',
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const hotel = await this.findById(id);

    // Soft delete — desativa o hotel
    hotel.isActive = false;
    await this.hotelRepository.save(hotel);
    this.logger.log(`Hotel desativado: ${hotel.name} (${hotel.id})`);

    await this.invalidateCache();
  }

  private async invalidateCache(): Promise<void> {
    const keys = [...this.activeCacheKeys];
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
    this.activeCacheKeys.clear();
    this.logger.debug('Cache Invalidation: Cache de hotéis invalidado');
  }

  private toResponseDto(hotel: Hotel): HotelResponseDto {
    return new HotelResponseDto({
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      state: hotel.state,
      address: hotel.address,
      totalRooms: hotel.totalRooms,
      starsRating: hotel.starsRating,
      description: hotel.description,
      phone: hotel.phone,
      email: hotel.email,
      isActive: hotel.isActive,
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt,
    });
  }
}
