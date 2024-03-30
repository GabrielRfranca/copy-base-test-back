"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpreadsheetReader = void 0;
const common_1 = require("@nestjs/common");
const xlsx = require("xlsx");
const csv = require("fast-csv");
const moment = require("moment");
const BRL_FORMAT = /\b(\d+)[.,](\d{1,2})\b/g;
const DATE_FORMAT_1 = 'M/D/YY H:mm';
const DATE_FORMAT_2 = 'MM/DD/YYYY';
const DATE_FORMAT_3 = 'M/D/YYYY';
const DATE_FORMAT_4 = 'M/D/YY';
const OUTPUT_DATE_FORMAT = 'YYYY/MM/DD';
const OUTPUT_DATETIME_FORMAT = 'YYYY/MM/DD HH:mm:ss';
let SpreadsheetReader = class SpreadsheetReader {
    async ProcessFile(file) {
        const jsonFile = await this.ConvertFileToJson(file);
        return await this.StandardizeDataFormat(jsonFile);
    }
    async ConvertFileToJson(file) {
        if (file.originalname.endsWith('.xlsx')) {
            return await this.ConvertXlsxToJson(file);
        }
        else if (file.originalname.endsWith('.csv')) {
            return await this.ConvertCsvToJson(file);
        }
        else {
            console.log("Arquivo não suportado");
        }
    }
    async ConvertXlsxToJson(file) {
        const workbook = xlsx.read(file.buffer);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return xlsx.utils.sheet_to_json(worksheet, { header: 1, raw: false });
    }
    async ConvertCsvToJson(file) {
        return new Promise((resolve, reject) => {
            let headers = null;
            const rows = [];
            csv.parseString(file.buffer.toString(), { headers: true })
                .on('data', (row) => {
                if (!headers) {
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
    async StandardizeDataFormat(jsonFile) {
        for (let array of jsonFile) {
            for (let i = 0; i < array.length; i++) {
                array[i] = this.FormatDate(array[i]);
            }
        }
        return jsonFile;
    }
    FormatDate(dateString) {
        if (moment(dateString, DATE_FORMAT_1, true).isValid()) {
            return moment(dateString, DATE_FORMAT_1).format(OUTPUT_DATETIME_FORMAT);
        }
        else if (moment(dateString, DATE_FORMAT_2, true).isValid()) {
            return moment(dateString, DATE_FORMAT_2).format(OUTPUT_DATE_FORMAT);
        }
        else if (moment(dateString, DATE_FORMAT_3, true).isValid()) {
            return moment(dateString, DATE_FORMAT_3).format(OUTPUT_DATE_FORMAT);
        }
        else if (moment(dateString, DATE_FORMAT_4, true).isValid()) {
            return moment(dateString, DATE_FORMAT_4).format(OUTPUT_DATE_FORMAT);
        }
        else {
            return this.FormatDecimal(dateString);
        }
    }
    FormatDecimal(numberString) {
        if (BRL_FORMAT.test(numberString)) {
            return numberString.replace(BRL_FORMAT, (match, p1, p2) => `${p1},${(p2).padEnd(2, '0')}`);
        }
        return numberString;
    }
};
exports.SpreadsheetReader = SpreadsheetReader;
exports.SpreadsheetReader = SpreadsheetReader = __decorate([
    (0, common_1.Injectable)()
], SpreadsheetReader);
//# sourceMappingURL=app.service.js.map