import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Importa User

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true, unique: true })
  taxId?: string;

  @Column({ nullable: true })
    logoUrl: string;


  @CreateDateColumn({ select: false }) // Ocultamos metadatos de las consultas por defecto
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  // --- NUEVOS CAMPOS DE LICENCIA ---
  @Column({ default: true })
  isLicenseActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  licenseExpiration: Date;

  @Column({ default: 'FREE' }) // Ejemplo: FREE, PRO, ENTERPRISE
  licensePlan: string;

  @Column({ type: 'varchar', nullable: true })
  machineId?: string; // Solo para planes de compra única

  @Column({ type: 'text', nullable: true }) // Usamos text porque la firma AES es larga
  licenseSignature: string;
  @Column({ default: '#3b82f6' }) // Color principal por defecto (Azul)
  primaryColor: string;

  @Column({ default: '0.5rem' }) // Bordes por defecto
  borderRadius: string;
    
  // Añade esta relación:
  @OneToMany(() => User, (user) => user.organization)
  users: User[];
}