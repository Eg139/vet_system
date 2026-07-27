// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  VET = 'VET',
  OWNER = 'OWNER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false }) // 🔐 RECOMENDACIÓN: TypeORM no traerá la clave en SELECTs a menos que se pida explícitamente
  password!: string;

  @Column()
  fullName!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VET })
  role!: UserRole;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;
}