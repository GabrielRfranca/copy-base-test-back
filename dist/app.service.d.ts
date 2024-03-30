export declare class SpreadsheetReader {
    ProcessFile(file: any): Promise<string[][]>;
    ConvertFileToJson(file: any): Promise<string[][]>;
    ConvertXlsxToJson(file: any): Promise<string[][]>;
    ConvertCsvToJson(file: any): Promise<string[][]>;
    StandardizeDataFormat(jsonFile: string[][]): Promise<string[][]>;
    FormatDate(dateString: string): string;
    FormatDecimal(numberString: string): string;
}
