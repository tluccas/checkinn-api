import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { HotelsService } from './hotels.service.js';
import { CreateHotelRequestDto } from './dto/create-hotel-request.dto.js';
import { UpdateHotelRequestDto } from './dto/update-hotel-request.dto.js';
import { HotelResponseDto } from './dto/hotel-response.dto.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateHotelRequestDto): Promise<HotelResponseDto> {
    return this.hotelsService.create(dto);
  }

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<HotelResponseDto>> {
    return this.hotelsService.findAll(query);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateHotelRequestDto,
  ): Promise<HotelResponseDto> {
    return this.hotelsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.hotelsService.remove(id);
  }
}
