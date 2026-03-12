import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service.js';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto.js';
import { UpdateReservationRequestDto } from './dto/update-reservation-request.dto.js';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto.js';
import { ReservationResponseDto } from './dto/reservation-response.dto.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateReservationRequestDto,
  ): Promise<ReservationResponseDto> {
    return this.reservationsService.create(dto);
  }

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ReservationResponseDto>> {
    return this.reservationsService.findAll(query);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateReservationRequestDto,
  ): Promise<ReservationResponseDto> {
    return this.reservationsService.update(id, dto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateReservationStatusDto,
  ): Promise<ReservationResponseDto> {
    return this.reservationsService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.reservationsService.remove(id);
  }
}
