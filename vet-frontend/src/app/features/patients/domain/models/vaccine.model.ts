export class Vaccine {
  constructor(
    private id: string,
    private type: 'VACCINE' | 'DEWORMER',
    private name: string,
    private applicationDate: Date,
    private dueDate: Date,
    private appliedBy: string,
    private batchNumber: string, // Vital por ley y trazabilidad médica
    private commercialProductId?: string // Referencia débil opcional por si acaso
  ) {}

  getId(): string { return this.id; }
  getType(): 'VACCINE' | 'DEWORMER' { return this.type; }
  getName(): string { return this.name; }
  getApplicationDate(): Date { return this.applicationDate; }
  getDueDate(): Date { return this.dueDate; }
  getAppliedBy(): string { return this.appliedBy; }
  getBatchNumber(): string { return this.batchNumber; }
}