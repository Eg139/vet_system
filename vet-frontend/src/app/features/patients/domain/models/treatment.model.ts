export class Treatment {
  constructor(
    private readonly id: string,
    private readonly patientId: string,
    private readonly medicationName: string,
    private readonly dosage: string,          // Ej: '1 tableta cada 12 horas'
    private readonly startDate: Date,
    private readonly endDate: Date,
    private readonly prescribedBy: string,    // Veterinario responsable
    private readonly instructions: string,    // Pautas especiales para el tutor
    private active: boolean = true
  ) {}

  public getId(): string { return this.id; }
  public getPatientId(): string { return this.patientId; }
  public getMedicationName(): string { return this.medicationName; }
  public getDosage(): string { return this.dosage; }
  public getStartDate(): Date { return this.startDate; }
  public getEndDate(): Date { return this.endDate; }
  public getPrescribedBy(): string { return this.prescribedBy; }
  public getInstructions(): string { return this.instructions; }
  public isActive(): boolean { return this.active; }

  public discontinue(): void {
    this.active = false;
  }
}