export class TreatmentEntity {
  constructor(
    private readonly id: string,
    private readonly patientId: string,
    private readonly orgId: string,
    private readonly medicationName: string,
    private readonly dosage: string, // Ej: '1 tableta cada 12 horas'
    private readonly startDate: Date,
    private readonly endDate: Date,
    private readonly prescribedBy: string, // Veterinario responsable
    private readonly instructions: string, // Pautas especiales para el tutor
    private active: boolean = true,
    private readonly createdAt: Date = new Date(),
  ) {
    this.validateRequiredFields();
  }

  private validateRequiredFields(): void {
    if (!this.patientId || this.patientId.trim().length === 0) {
      throw new Error('El ID del paciente es obligatorio.');
    }
    if (!this.orgId || this.orgId.trim().length === 0) {
      throw new Error('El ID de la organización es obligatorio.');
    }
    if (!this.medicationName || this.medicationName.trim().length === 0) {
      throw new Error('El nombre del medicamento es obligatorio.');
    }
    if (!this.dosage || this.dosage.trim().length === 0) {
      throw new Error('La dosis es obligatoria.');
    }
    if (!this.prescribedBy || this.prescribedBy.trim().length === 0) {
      throw new Error('El veterinario responsable es obligatorio.');
    }
    if (this.startDate && this.endDate && new Date(this.startDate) > new Date(this.endDate)) {
      throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin.');
    }
  }

  // Getters
  public getId(): string { return this.id; }
  public getPatientId(): string { return this.patientId; }
  public getOrgId(): string { return this.orgId; }
  public getMedicationName(): string { return this.medicationName; }
  public getDosage(): string { return this.dosage; }
  public getStartDate(): Date { return this.startDate; }
  public getEndDate(): Date { return this.endDate; }
  public getPrescribedBy(): string { return this.prescribedBy; }
  public getInstructions(): string { return this.instructions; }
  public isActive(): boolean { return this.active; }
  public getCreatedAt(): Date { return this.createdAt; }

  // Comportamiento de negocio
  public discontinue(): void {
    this.active = false;
  }
}