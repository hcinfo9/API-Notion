import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { Client } from '@notionhq/client';
import Redis from 'ioredis';

@Injectable()
export class NotionService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}
  private notion = new Client({ auth: process.env.NOTION_API_KEY });
  private databaseId: string = process.env.NOTION_DATABASE_ID;

  async getAllRecords() {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
      });
      return { sucess: true, data: response.results };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao tentar recuperar todos os registros no Banco Notion',
        error: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getRecordById(pageId: string) {
    try {
      const response = await this.notion.pages.retrieve({ page_id: pageId });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message:
          'Erro ao tentar recuperar registro com base no ID no Banco Notion',
        error: error.message,
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  }

  async createRecord(data: Record<string, any>) {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: data,
      });

      await this.redisClient.set(
        `IdPage:${response.id}`,
        JSON.stringify(response),
      );

      return {
        sucess: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao tentar criar um novo registro no Banco Notion',
        error: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async updateRecord(pageId: string, updateData: Record<string, any>) {
    try {
      const exists = await this.redisClient.get(`IdPage:${pageId}`);
      if (!exists) {
        return {
          success: false,
          message: 'Registro não encontrado no Redis',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
      const response = await this.notion.pages.update({
        page_id: pageId,
        properties: updateData,
      });

      await this.redisClient.set(`IdPage:${pageId}`, JSON.stringify(response));

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        sucess: false,
        message: 'Erro ao atualizar registro no Banco Notion',
        error: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async deleteRecord(pageId: string) {
    try {
      const exists = await this.redisClient.get(`IdPage:${pageId}`);
      if (!exists) {
        return {
          success: false,
          message: 'Registro não encontrado no Redis',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      const response = await this.notion.pages.update({
        page_id: pageId,
        archived: true,
      });

      await this.redisClient.del(`IdPage:${pageId}`);

      return { sucess: true, data: response };
    } catch (error) {
      return {
        sucess: false,
        message: 'Erro ao excluir registro no Banco Notion',
        error: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
