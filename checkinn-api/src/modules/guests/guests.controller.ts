import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GuestsService } from './guests.service.js';
import { CreateGuestRequestDto } from './dto/create-guest-request.dto.js';
import { UpdateGuestRequestDto } from './dto/update-guest-request.dto.js';
import { GuestResponseDto } from './dto/guest-response.dto.js';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateGuestRequestDto): Promise<GuestResponseDto> {
    return this.guestsService.create(dto);
  }

  @Get('reservation/:reservationId')
  async findByReservation(
    @Param('reservationId', new ParseUUIDPipe()) reservationId: string,
  ): Promise<GuestResponseDto[]> {
    return this.guestsService.findByReservation(reservationId);
  }

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<GuestResponseDto> {
    return this.guestsService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateGuestRequestDto,
  ): Promise<GuestResponseDto> {
    return this.guestsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.guestsService.remove(id);
  }
}
