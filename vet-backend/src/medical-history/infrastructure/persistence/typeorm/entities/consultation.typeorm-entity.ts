import { Entity, PrimaryColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { PetOrmEntity } from '../../../../../patients/infrastructure/persistence/typeorm/entities/pet.orm-entity';

@Entity('consultations')
@Index(['id', 'orgId'], { unique: true })
export class ConsultationOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'patient_id', type: 'uuid' })
  @Index()
  patientId!: string;

  @ManyToOne(() => PetOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: PetOrmEntity;

  @Column({ name: 'org_id', type: 'uuid' })
  @Index()
  orgId!: string;

  @Column()
  veterinarian!: string;

  @Column({ type: 'text' })
  subjective!: string;

  @Column({ type: 'text' })
  objective!: string;

  @Column({ type: 'text' })
  assessment!: string;

  @Column({ type: 'text' })
  plan!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight!: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  temperature!: number | null;

  @Column({ name: 'heart_rate', type: 'int', nullable: true })
  heartRate!: number | null;

  @Column({ name: 'respiratory_rate', type: 'int', nullable: true })
  respiratoryRate!: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}