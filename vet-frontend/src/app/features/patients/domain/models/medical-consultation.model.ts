export class MedicalConsultation {
  constructor(
    private readonly id: string,
    private readonly petId: string,
    private readonly date: Date,
    private readonly veterinarianId: string,
    private subjective: string,  // (S) Lo que relata el dueño / anamnesis
    private objective: string,   // (O) Lo que mide el veterinario (constantes, examen físico)
    private assessment: string,  // (A) Diagnóstico o conclusión clínica
    private plan: string,        // (P) Tratamiento, recetas, indicaciones y próximos pasos
  ) {}

  // ==========================================
  // Getters para lectura (UI / Mappers)
  // ==========================================
  public getId(): string { return this.id; }
  public getPetId(): string { return this.petId; }
  public getDate(): Date { return this.date; }
  public getVeterinarianId(): string { return this.veterinarianId; }
  public getSubjective(): string { return this.subjective; }
  public getObjective(): string { return this.objective; }
  public getAssessment(): string { return this.assessment; }
  public getPlan(): string { return this.plan; }

  // ==========================================
  // Métodos de Negocio / Comportamiento (SOAP)
  // ==========================================
  public updateSubjective(newSubjective: string): void {
    if (!newSubjective || newSubjective.trim().length === 0) {
      throw new Error('El campo Subjetivo no puede estar vacío.');
    }
    this.subjective = newSubjective;
  }

  public updateObjective(newObjective: string): void {
    if (!newObjective || newObjective.trim().length === 0) {
      throw new Error('El campo Objetivo no puede estar vacío.');
    }
    this.objective = newObjective;
  }

  public updateAssessment(newAssessment: string): void {
    if (!newAssessment || newAssessment.trim().length === 0) {
      throw new Error('El Análisis (Diagnóstico) no puede estar vacío.');
    }
    this.assessment = newAssessment;
  }

  public updatePlan(newPlan: string): void {
    if (!newPlan || newPlan.trim().length === 0) {
      throw new Error('El Plan de tratamiento no puede estar vacío.');
    }
    this.plan = newPlan;
  }
}