import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('prescriptions')
export class PrescriptionTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  consultationId!: string;

  @Index()
  @Column({ type: 'uuid' })
  orgId!: string;

  @Column({ type: 'varchar', length: 150 })
  patientName!: string;

  @Column({ type: 'varchar', length: 150 })
  veterinarianName!: string;

  @Column({ type: 'varchar', length: 100 })
  licenseNumber!: string; // Ej: "Matrícula Provincial N° 1234"

  @Column({ type: 'text' })
  diagnosis!: string;

  @Column({ type: 'text' })
  indications!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date; // Sello de tiempo inalterable para auditoría
}