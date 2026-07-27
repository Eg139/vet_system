// src/patients/infrastructure/persistence/typeorm/entities/owner.orm-entity.ts
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { PetOrmEntity } from './pet.orm-entity';

@Entity('owners')
@Index(['id', 'orgId'], { unique: true }) // Garantiza consulta rápida por id + tenant
@Index(['email', 'orgId'], { unique: true }) // 👈 🛡️ Garantiza que un email no se repita en la misma organización
export class OwnerOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  // FK opcional hacia la tabla de usuarios de autenticación.
  // Si el cliente no usa la app de Angular, esto queda NULL en la base de datos (ahorro de espacio).
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  @Index()
  userId?: string | null;

  @Column({ name: 'org_id', type: 'uuid' })
  @Index()
  orgId!: string;

  // Relación inversa: Un dueño puede tener muchas mascotas asignadas
  @OneToMany(() => PetOrmEntity, (pet) => pet.owner)
  pets!: PetOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}