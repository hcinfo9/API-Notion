import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { NotionService } from '../notion/notion.service';
import { JwtAuthGuard, OptionalAuth } from 'src/auth/guards/jwt-auth.guard';

@Controller('notion')
export class NotionController {
  constructor(private readonly notionService: NotionService) {}

  @UseGuards(JwtAuthGuard)
  @OptionalAuth()
  @Get(':id')
  async getAllRecords() {
    try {
      return await this.notionService.getAllRecords();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createRecord(@Body() createData: Record<string, any>) {
    try {
      return await this.notionService.createRecord(createData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateRecord(
    @Param('id') id: string,
    @Body() updateData: Record<string, any>,
  ) {
    try {
      return await this.notionService.updateRecord(id, updateData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteRecord(@Param('id') id: string) {
    try {
      return await this.notionService.deleteRecord(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
