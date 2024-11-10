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
} from '@nestjs/common';
import { NotionService } from '../notion/notion.service';
import { JwtAuthGuard, OptionalAuth } from '../auth/guards/jwt-auth.guard';
import { NotionSchema } from './schema/notion.schema';

@Controller('notion')
export class NotionController {
  constructor(private readonly notionService: NotionService) {}

  @UseGuards(JwtAuthGuard)
  @OptionalAuth()
  @Get()
  async getAllRecords() {
    try {
      return await this.notionService.getAllRecords();
    } catch (error) {
      return {
        message: 'Erro ao buscar registros no Notion',
        statusCode: HttpStatus.BAD_REQUEST,
        error: error.message,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @OptionalAuth()
  @Get(':id')
  async getRecordById(@Param('id') id: string) {
    try {
      return await this.notionService.getRecordById(id);
    } catch (error) {
      return {
        message: 'Erro ao buscar registro no Notion',
        statusCode: HttpStatus.BAD_REQUEST,
        error: error.message,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createRecord(@Body() body: Record<string, any>) {
    try {
      const notionPayload = NotionSchema(body);
      return await this.notionService.createRecord(notionPayload);
    } catch (error) {
      return {
        message: 'Erro ao tentar criar registro no Notion',
        statusCode: HttpStatus.BAD_REQUEST,
        error: error.message,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateRecord(
    @Param('id') id: string,
    @Body() updateData: Record<string, any>,
  ) {
    try {
      const notionPayload = NotionSchema(updateData);
      return await this.notionService.updateRecord(id, notionPayload);
    } catch (error) {
      return {
        message: 'Erro ao atualizar o registro no Notion',
        statusCode: HttpStatus.BAD_REQUEST,
        error: error.message,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteRecord(@Param('id') id: string) {
    try {
      return await this.notionService.deleteRecord(id);
    } catch (error) {
      return {
        message: 'Erro ao deletar o registro no Notion',
        statusCode: HttpStatus.BAD_REQUEST,
        error: error.message,
      };
    }
  }
}
