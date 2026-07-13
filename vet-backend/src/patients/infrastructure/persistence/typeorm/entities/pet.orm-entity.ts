// src/patients/infrastructure/persistence/typeorm/entities/pet.orm-entity.ts
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { OwnerOrmEntity } from './owner.orm-entity'; 
@Entity('pets')
@Index(['id', 'orgId'], { unique: true })
export class PetOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  species!: string;

  @Column()
  breed!: string;

  @Column({ name: 'birth_date', type: 'timestamp' })
  birthDate!: Date;

  // Mantenemos la columna física del ID para búsquedas rápidas directas
  @Column({ name: 'owner_id', type: 'uuid' })
  @Index()
  ownerId!: string;

  // --- ACÁ METEMOS LA RELACIÓN EFICIENTE ---
  // Muchas mascotas pertenecen a UN dueño. RESTRICT evita borrar un dueño si tiene mascotas asignadas.
  @ManyToOne(() => OwnerOrmEntity, (owner) => owner.pets, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_id' })
  owner!: OwnerOrmEntity;
  // ----------------------------------------

  @Column({ name: 'org_id', type: 'uuid' })
  @Index()
  orgId!: string;

  @Column({ name: 'blood_type', default: 'Desconocido' })
  bloodType!: string;

  @Column({ name: 'is_neutered', type: 'boolean', default: false })
  isNeutered!: boolean;

  @Column({ name: 'chronic_allergies', type: 'simple-array', default: '' })
  chronicAllergies!: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}