import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('patient_vaccines')
export class VaccineTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @Column({ name: 'org_id', type: 'varchar' })
  orgId: string;

  @Column({ name: 'vaccine_name', type: 'varchar' })
  vaccineName: string;

  @Column({ name: 'batch_number', type: 'varchar' })
  batchNumber: string;

  @Column({ name: 'administered_by', type: 'varchar' })
  administeredBy: string;

  @Column({ name: 'application_date', type: 'timestamp' })
  applicationDate: Date;

  @Column({ name: 'next_due_date', type: 'timestamp', nullable: true })
  nextDueDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}