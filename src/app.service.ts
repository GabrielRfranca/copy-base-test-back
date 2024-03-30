import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';
import * as csv from 'fast-csv';
import * as moment from 'moment';

const BRL_FORMAT = /\b(\d+)[.,](\d{1,2})\b/g;
const DATE_FORMAT_1 = 'M/D/YY H:mm';
const DATE_FORMAT_2 = 'MM/DD/YYYY';
const DATE_FORMAT_3 = 'M/D/YYYY';
const DATE_FORMAT_4 = 'M/D/YY';
const OUTPUT_DATE_FORMAT = 'YYYY/MM/DD';
const OUTPUT_DATETIME_FORMAT = 'YYYY/MM/DD HH:mm:ss';

@Injectable()
export class SpreadsheetReader {
  async ProcessFile(file: any): Promise<string[][]> 
  {
    const jsonFile = await this.ConvertFileToJson(file);
    return await this.StandardizeDataFormat(jsonFile);
  }

 async ConvertFileToJson(file: any): Promise<string[][]>
 {
    if(file.originalname.endsWith('.xlsx'))
    {
      return await this.ConvertXlsxToJson(file);
    }
    else if (file.originalname.endsWith('.csv'))
    {
      return await this.ConvertCsvToJson(file);
    }
    else
    {
      console.log("Arquivo não suportado");
    }
 }

  async ConvertXlsxToJson(file: any): Promise<string[][]>{
    const workbook = xlsx.read(file.buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet, { header: 1, raw: false });
  }

  async ConvertCsvToJson(file: any): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      let headers = null;
      const rows = [];
      csv.parseString(file.buffer.toString(), { headers: true })
        .on('data', (row) => {
          if (!headers) 
          {
            headers = Object.keys(row);
            rows.push(headers);
          }
          const data = headers.map(header => row[header] || null);
          rows.push(data);
        })
        .on('end', () => {
          resolve(rows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async StandardizeDataFormat(jsonFile: string [][]): Promise<string [][]>{
    for (let array of jsonFile) 
    {
      for (let i = 0; i < array.length; i++) 
      {
        array[i] = this.FormatDate(array[i]);
      }
    }
    return jsonFile;
  }

  FormatDate(dateString: string): string {
    if (moment(dateString, DATE_FORMAT_1, true).isValid()) 
    {
      return moment(dateString, DATE_FORMAT_1).format(OUTPUT_DATETIME_FORMAT);
    } 
    else if (moment(dateString, DATE_FORMAT_2, true).isValid()) 
    {
      return moment(dateString, DATE_FORMAT_2).format(OUTPUT_DATE_FORMAT);
    }
    else if (moment(dateString, DATE_FORMAT_3, true).isValid())
    {
      return moment(dateString, DATE_FORMAT_3).format(OUTPUT_DATE_FORMAT);
    }
    else if (moment(dateString, DATE_FORMAT_4, true).isValid())
    {
      return moment(dateString, DATE_FORMAT_4).format(OUTPUT_DATE_FORMAT);
    }
    else 
    {
      return this.FormatDecimal(dateString);
    }
  }

  FormatDecimal(numberString: string): string {
    if (BRL_FORMAT.test(numberString)) 
    {
      return numberString.replace(BRL_FORMAT, (match, p1, p2) => `${p1},${(p2).padEnd(2, '0')}`);
    }
    return numberString;
  }
  
}
