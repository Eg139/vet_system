import { Injectable } from '@nestjs/common';
import { IPdfGenerator, PrescriptionPdfData } from '../../domain/ports/pdf-generator.interface';
import * as PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Injectable()
export class PdfMakeGeneratorService implements IPdfGenerator {
  private printer: PdfPrinter;

  constructor() {
    // Puedes configurar fuentes personalizadas aquí si lo deseas en el futuro
    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    this.printer = new PdfPrinter(fonts);
  }

  async generatePrescriptionPdf(data: PrescriptionPdfData): Promise<Buffer> {
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 10,
        color: '#333333',
      },
      content: [
        // Encabezado de la Clínica
        {
          text: data.clinicName.toUpperCase(),
          fontSize: 18,
          bold: true,
          alignment: 'center',
          color: '#2c3e50',
        },
        {
          text: 'Receta Médica Veterinaria',
          fontSize: 12,
          alignment: 'center',
          color: '#7f8c8d',
          margin: [0, 2, 0, 20],
        },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#bdc3c7' }], margin: [0, 0, 0, 15] },

        // Datos del Profesional y Fecha
        {
          columns: [
            {
              stack: [
                { text: `Veterinario: ${data.veterinarianName}`, bold: true },
                { text: `Matrícula N°: ${data.licenseNumber}` },
              ],
            },
            {
              text: `Fecha: ${data.date.toLocaleDateString()}`,
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 15],
        },

        // Datos del Paciente / Propietario
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                { text: `Paciente: ${data.patientName}`, bold: true, fillColor: '#ecf0f1', padding: [8, 8, 8, 8] },
                { text: `Propietario: ${data.ownerName}`, bold: true, fillColor: '#ecf0f1', padding: [8, 8, 8, 8] },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 20],
        },

        // Diagnóstico
        { text: 'DIAGNÓSTICO', fontSize: 11, bold: true, color: '#2980b9', margin: [0, 0, 0, 5] },
        { text: data.diagnosis, margin: [0, 0, 0, 15] },

        // Indicaciones / Tratamiento
        { text: 'INDICACIONES / TRATAMIENTO', fontSize: 11, bold: true, color: '#2980b9', margin: [0, 0, 0, 5] },
        { text: data.indications, margin: [0, 0, 0, 40] },

        // Firma al pie
        {
          columns: [
            { text: '' },
            {
              stack: [
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 180, y2: 0, lineWidth: 1 }] },
                { text: data.veterinarianName, alignment: 'center', margin: [0, 5, 0, 2], bold: true },
                { text: `Mat. ${data.licenseNumber}`, alignment: 'center', fontSize: 9, color: '#7f8c8d' },
              ],
              alignment: 'center',
            },
          ],
        },
      ],
    };

    return new Promise((resolve, reject) => {
      const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];

      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', (err) => reject(err));
      
      pdfDoc.end();
    });
  }
}