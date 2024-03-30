import { Module } from '@nestjs/common';
import { UploadController } from './app.controller';
import { SpreadsheetReader } from './app.service';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [SpreadsheetReader],
})
export class AppModule {}