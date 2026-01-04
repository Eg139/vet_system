import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,BeforeInsert } from 'typeorm';
// Asegúrate de que la ruta sea correcta según tu carpeta
import { Organization } from '../../organizations/entities/organization.entity'; 
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  fullName: string;

  // ESTA ES LA PARTE QUE DA EL ERROR:
  @ManyToOne(
    () => Organization, 
    (organization) => organization.users, 
    { nullable: false }
  )
    organization: Organization; // <- Asegúrate de que termine en punto y coma
  // --- EL HOOK ---
  @BeforeInsert()
  async hashPassword() {
    // Definimos la complejidad del hash (10 es el estándar balanceado)
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Contraseña hasheada automáticamente antes de insertar 🛡️');
  }

  
}