import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt'; // 👈 Importamos bcrypt
import { AppDataSource } from '../../config/data-source';

// 🏢 Módulos Tradicionales (Importan directo de entities/):
import { Organization } from '../../organizations/entities/organization.entity';
import { User, UserRole } from '../../users/entities/user.entity';

// 🐶 Módulo Hexagonal/Patients (Importan de infraestructura/persistencia):
import { OwnerOrmEntity } from '../../patients/infrastructure/persistence/typeorm/entities/owner.orm-entity';
import { PetOrmEntity } from '../../patients/infrastructure/persistence/typeorm/entities/pet.orm-entity';

const SALT_ROUNDS = 10;

async function seed() {
  await AppDataSource.initialize();
  console.log('🌱 Conexión inicializada para el Seed...');

  const orgRepo = AppDataSource.getRepository(Organization);
  const userRepo = AppDataSource.getRepository(User);
  const ownerRepo = AppDataSource.getRepository(OwnerOrmEntity);
  const petRepo = AppDataSource.getRepository(PetOrmEntity);

  // 1. Organización
  let myOrg = await orgRepo.findOne({ where: { name: 'Veterinaria Eric' } });
  if (!myOrg) {
    myOrg = orgRepo.create({ name: 'Veterinaria Eric' });
    myOrg = await orgRepo.save(myOrg);
    console.log('✅ Organización creada:', myOrg.name);
  }

  // 2. Admin
  const adminEmail = 'admin@vet.com';
  const rawPassword = 'admin_password_123';
  const hashedPassword = await bcrypt.hash(rawPassword, SALT_ROUNDS); // 🔒 Hasheo de la clave

  let adminUser = await userRepo.findOne({ where: { email: adminEmail } });

  if (!adminUser) {
    adminUser = userRepo.create({
      email: adminEmail,
      password: hashedPassword, // 👈 Se guarda el hash generado
      fullName: 'Eric Admin',
      role: UserRole.ADMIN,
      organization: myOrg,
    });
    await userRepo.save(adminUser);
    console.log('✅ Usuario Admin creado con contraseña encriptada.');
  } else {
    // 🛠️ Si el usuario ya existía de un seed previo, actualizamos la clave a hash por seguridad
    adminUser.password = hashedPassword;
    await userRepo.save(adminUser);
    console.log('🔄 Contraseña de Usuario Admin actualizada con hash bcrypt.');
  }

  // 3. Owners
  const ownersData = [
    {
      firstName: 'Carlos',
      lastName: 'Pérez',
      email: 'carlos.perez@gmail.com',
      phone: '1122334455',
    },
    {
      firstName: 'María',
      lastName: 'Gómez',
      email: 'maria.gomez@gmail.com',
      phone: '1166778899',
    },
  ];

  const savedOwners: OwnerOrmEntity[] = [];

  for (const data of ownersData) {
    let owner = await ownerRepo.findOne({ where: { email: data.email, orgId: myOrg.id } });
    if (!owner) {
      owner = ownerRepo.create({
        id: randomUUID(),
        ...data,
        orgId: myOrg.id,
      });
      owner = await ownerRepo.save(owner);
      console.log(`✅ Dueño creado: ${owner.firstName} ${owner.lastName}`);
    }
    savedOwners.push(owner);
  }

  // 4. Pets
  const petsData = [
    {
      name: 'Firulais',
      species: 'Perro',
      breed: 'Mestizo',
      birthDate: new Date('2021-05-10'),
      photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
      owner: savedOwners[0],
    },
    {
      name: 'Milo',
      species: 'Perro',
      breed: 'Yorkshire Terrier',
      birthDate: new Date('2022-11-15'),
      photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
      owner: savedOwners[1],
    },
  ];

  for (const data of petsData) {
    let pet = await petRepo.findOne({
      where: { name: data.name, orgId: myOrg.id },
    });

    if (!pet) {
      pet = petRepo.create({
        id: randomUUID(),
        name: data.name,
        species: data.species,
        breed: data.breed,
        birthDate: data.birthDate,
        photoUrl: data.photoUrl,
        owner: data.owner,
        orgId: myOrg.id,
      });
      await petRepo.save(pet);
      console.log(`🐶 Mascota creada: ${pet.name}`);
    }
  }

  console.log('🚀 ¡Seed completado con éxito!');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Error durante el Seed:', error);
  process.exit(1);
});