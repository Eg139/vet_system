export class Consultation {
  constructor(
    private readonly id: string,
    private readonly patientId: string, // 👈 Añadido aquí
    private readonly veterinarian: string,
    private readonly date: Date,
    private readonly subjective: string,
    private readonly objective: string,
    private readonly assessment: string,
    private readonly plan: string
  ) {}

  getId(): string { return this.id; }
  getPatientId(): string { return this.patientId; } // 👈 Añadido getter
  getVeterinarian(): string { return this.veterinarian; }
  getDate(): Date { return this.date; }
  getSubjective(): string { return this.subjective; }
  getObjective(): string { return this.objective; }
  getAssessment(): string { return this.assessment; }
  getPlan(): string { return this.plan; }
}