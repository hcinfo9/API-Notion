import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Client } from '@notionhq/client';

@Injectable()
export class NotionService {
  private notion = new Client({ auth: process.env.NOTION_API_KEY });
  private databaseId: string = process.env.NOTION_DATABASE_ID;

  async getAllRecords() {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
      });
      return response.results;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createRecord(data: Record<string, any>) {
    try {
      const properties = this.tranformDataFormatNotion(data);

      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties,
      });
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateRecord(pageId: string, updateData: Record<string, any>) {
    try {
      const properties = this.tranformDataFormatNotion(updateData);

      const response = await this.notion.pages.update({
        page_id: pageId,
        properties,
      });
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteRecord(id: string) {
    try {
      await this.notion.pages.update({
        page_id: id,
        archived: true,
      });
      return { message: 'Registro excluído com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private tranformDataFormatNotion(data: Record<string, any>) {
    const transformed: Record<string, any> = {};

    Object.keys(data).forEach((key) => {
      const value = data[key];

      transformed[key] = this.formatProperty(value);
    });

    return transformed;
  }

  private formatProperty(value: any) {
    if (typeof value === 'string') {
      return { title: [{ text: { content: value } }] };
    }
    if (typeof value === 'number') {
      return { number: value };
    }
    if (Array.isArray(value)) {
      return { multi_select: value.map((item) => ({ name: item })) };
    }
    if (value instanceof Date) {
      return { date: { start: value.toISOString() } };
    }
    if (typeof value === 'boolean') {
      return { checkbox: value };
    }
    if (typeof value === 'object' && value.url) {
      return { url: value.url };
    }

    return { rich_text: [{ text: { content: String(value) } }] };
  }
}
