export class VaccineEntity {
  constructor(
    private readonly id: string,
    private readonly patientId: string,
    private readonly orgId: string,
    private vaccineName: string,
    private batchNumber: string,
    private administeredBy: string,
    private applicationDate: Date,
    private nextDueDate?: Date,
    private notes?: string,
    private readonly createdAt: Date = new Date(),
  ) {
    this.validateRequiredFields();
  }

  // ==========================================
  // Validaciones de Invariantes de Negocio
  // ==========================================
  private validateRequiredFields(): void {
    if (!this.patientId || this.patientId.trim().length === 0) {
      throw new Error('El ID del paciente es obligatorio para registrar una vacuna.');
    }
    if (!this.orgId || this.orgId.trim().length === 0) {
      throw new Error('El ID de la organización es obligatorio.');
    }
    if (!this.vaccineName || this.vaccineName.trim().length === 0) {
      throw new Error('El nombre de la vacuna es obligatorio.');
    }
    if (!this.batchNumber || this.batchNumber.trim().length === 0) {
      throw new Error('El número de lote de la vacuna es obligatorio por normativas sanitarias.');
    }
    if (!this.administeredBy || this.administeredBy.trim().length === 0) {
      throw new Error('El nombre del veterinario o personal que administra la vacuna es obligatorio.');
    }
    if (!this.applicationDate) {
      throw new Error('La fecha de aplicación de la vacuna es obligatoria.');
    }
  }

  // ==========================================
  // Getters obligatorios
  // ==========================================
  public getId(): string { return this.id; }
  public getPatientId(): string { return this.patientId; }
  public getOrgId(): string { return this.orgId; }
  public getVaccineName(): string { return this.vaccineName; }
  public getBatchNumber(): string { return this.batchNumber; }
  public getAdministeredBy(): string { return this.administeredBy; }
  public getApplicationDate(): Date { return this.applicationDate; }
  public getNextDueDate(): Date | undefined { return this.nextDueDate; }
  public getNotes(): string | undefined { return this.notes; }
  public getCreatedAt(): Date { return this.createdAt; }
}