import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('treatments')
export class TreatmentTypeOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId!: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId!: string;

  @Column({ name: 'medication_name', type: 'varchar', length: 255 })
  medicationName!: string;

  @Column({ type: 'varchar', length: 255 })
  dosage!: string;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate!: Date;

  @Column({ name: 'prescribed_by', type: 'varchar', length: 255 })
  prescribedBy!: string;

 @Column({ type: 'text', nullable: true })
  instructions!: string | null; // <--- Permitimos null explícitamente

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}