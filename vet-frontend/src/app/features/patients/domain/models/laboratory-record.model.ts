export class LaboratoryRecord {
  constructor(
    private readonly id: string,
    private readonly patientId: string,
    private readonly title: string,                  // Ej: 'Hemograma Completo' o 'Radiografía Torácica'
    private readonly category: 'LABORATORY' | 'IMAGING',
    private readonly date: Date,
    private readonly orderedBy: string,              // Veterinario solicitante
    private readonly resultsSummary: string,         // Conclusión clínica o valores destacados
    private readonly fileUrl?: string                // Enlace al archivo adjunto (PDF / Imagen)
  ) {}

  public getId(): string { return this.id; }
  public getPatientId(): string { return this.patientId; }
  public getTitle(): string { return this.title; }
  public getCategory(): 'LABORATORY' | 'IMAGING' { return this.category; }
  public getDate(): Date { return this.date; }
  public getOrderedBy(): string { return this.orderedBy; }
  public getResultsSummary(): string { return this.resultsSummary; }
  public getFileUrl(): string | undefined { return this.fileUrl; }
}