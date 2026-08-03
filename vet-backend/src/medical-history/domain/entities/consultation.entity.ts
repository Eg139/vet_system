export class ConsultationEntity {
  constructor(
    private readonly id: string,
    private readonly patientId: string,
    private readonly orgId: string,
    private readonly veterinarian: string,
    private subjective: string,
    private objective: string,
    private assessment: string,
    private plan: string,
    private weight?: number,
    private temperature?: number,
    private heartRate?: number,
    private respiratoryRate?: number,
    private readonly createdAt: Date = new Date(),
  ) {
    this.validateRequiredFields();
  }

  // ==========================================
  // Validaciones de Invariantes de Negocio
  // ==========================================
  private validateRequiredFields(): void {
    if (!this.patientId || this.patientId.trim().length === 0) {
      throw new Error('El ID del paciente es obligatorio para la consulta.');
    }
    if (!this.orgId || this.orgId.trim().length === 0) {
      throw new Error('El ID de la organización es obligatorio.');
    }
    if (!this.veterinarian || this.veterinarian.trim().length === 0) {
      throw new Error('El nombre del veterinario tratante es obligatorio.');
    }
    if (!this.subjective || this.subjective.trim().length === 0) {
      throw new Error('La sección subjetiva (anamnesis) no puede estar vacía.');
    }
    if (!this.objective || this.objective.trim().length === 0) {
      throw new Error('La sección objetiva (hallazgos físicos) no puede estar vacía.');
    }
    if (!this.assessment || this.assessment.trim().length === 0) {
      throw new Error('La evaluación (diagnóstico presuntivo) es obligatoria.');
    }
    if (!this.plan || this.plan.trim().length === 0) {
      throw new Error('El plan médico es obligatorio.');
    }
  }

  // ==========================================
  // Getters obligatorios
  // ==========================================
  public getId(): string { return this.id; }
  public getPatientId(): string { return this.patientId; }
  public getOrgId(): string { return this.orgId; }
  public getVeterinarian(): string { return this.veterinarian; }
  public getSubjective(): string { return this.subjective; }
  public getObjective(): string { return this.objective; }
  public getAssessment(): string { return this.assessment; }
  public getPlan(): string { return this.plan; }
  public getWeight(): number | undefined { return this.weight; }
  public getTemperature(): number | undefined { return this.temperature; }
  public getHeartRate(): number | undefined { return this.heartRate; }
  public getRespiratoryRate(): number | undefined { return this.respiratoryRate; }
  public getCreatedAt(): Date { return this.createdAt; }

  // ==========================================
  // Métodos semánticos de negocio (Comportamiento)
  // ==========================================
  public updateSubjective(newSubjective: string): void {
    if (!newSubjective || newSubjective.trim().length === 0) {
      throw new Error('La nota subjetiva no puede estar vacía.');
    }
    this.subjective = newSubjective;
  }

  public updateObjective(newObjective: string): void {
    if (!newObjective || newObjective.trim().length === 0) {
      throw new Error('La nota objetiva no puede estar vacía.');
    }
    this.objective = newObjective;
  }

  public updateAssessment(newAssessment: string): void {
    if (!newAssessment || newAssessment.trim().length === 0) {
      throw new Error('La evaluación no puede estar vacía.');
    }
    this.assessment = newAssessment;
  }

  public updatePlan(newPlan: string): void {
    if (!newPlan || newPlan.trim().length === 0) {
      throw new Error('El plan médico no puede estar vacío.');
    }
    this.plan = newPlan;
  }

  public updateVitals(weight?: number, temperature?: number, heartRate?: number, respiratoryRate?: number): void {
    if (weight !== undefined && weight < 0) {
      throw new Error('El peso no puede ser un valor negativo.');
    }
    if (temperature !== undefined && (temperature < 30 || temperature > 45)) {
      throw new Error('La temperatura corporal está fuera de rango lógico para un animal.');
    }
    if (weight !== undefined) this.weight = weight;
    if (temperature !== undefined) this.temperature = temperature;
    if (heartRate !== undefined) this.heartRate = heartRate;
    if (respiratoryRate !== undefined) this.respiratoryRate = respiratoryRate;
  }
}