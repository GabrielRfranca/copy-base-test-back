import { SpreadsheetReader } from './app.service';
export declare class UploadController {
    private readonly spreadsheetReader;
    constructor(spreadsheetReader: SpreadsheetReader);
    UploadFile(file: any): Promise<string[][]>;
}
