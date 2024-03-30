import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SpreadsheetReader } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class UploadController {
  constructor(private readonly spreadsheetReader: SpreadsheetReader) {} 

  @Post('spreadsheet')
  @UseInterceptors(FileInterceptor('file'))
  async UploadFile(@UploadedFile() file: any): Promise<string [][]> {
    return await this.spreadsheetReader.ProcessFile(file); 
  }
}

