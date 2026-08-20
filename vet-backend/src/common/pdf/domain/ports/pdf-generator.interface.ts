export const PDF_GENERATOR_TOKEN = 'PDF_GENERATOR_TOKEN';

export interface IPdfGenerator {
  generatePrescriptionPdf(data: PrescriptionPdfData): Promise<Buffer>;
}

// Estructura de datos limpia que consumirá la plantilla
export interface PrescriptionPdfData {
  clinicName: string;
  veterinarianName: string;
  licenseNumber: string;
  patientName: string;
  ownerName: string;
  diagnosis: string;
  indications: string;
  date: Date;
}