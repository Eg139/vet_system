export class PrescriptionEntity {
  constructor(
    private readonly id: string,
    private readonly consultationId: string,
    private readonly orgId: string,
    private readonly patientName: string,
    private readonly veterinarianName: string,
    private readonly licenseNumber: string, // Matrícula profesional regulatoria
    private readonly diagnosis: string,
    private readonly indications: string,
    private readonly createdAt: Date,
  ) {}

  public getId(): string { return this.id; }
  public getConsultationId(): string { return this.consultationId; }
  public getOrgId(): string { return this.orgId; }
  public getPatientName(): string { return this.patientName; }
  public getVeterinarianName(): string { return this.veterinarianName; }
  public getLicenseNumber(): string { return this.licenseNumber; }
  public getDiagnosis(): string { return this.diagnosis; }
  public getIndications(): string { return this.indications; }
  public getCreatedAt(): Date { return this.createdAt; }
}