import { AppDataSource } from '../../config/data-source';
import { Organization } from '../../organizations/entities/organization.entity';
import { User } from '../../users/entities/user.entity';

async function seed() {
  // Inicializamos la conexión
  await AppDataSource.initialize();
  console.log('Conexión inicializada para el Seed...');

  const orgRepo = AppDataSource.getRepository(Organization);
  const userRepo = AppDataSource.getRepository(User);

  // 1. Crear la Organización (tu veterinaria)
  // Nota: Asegúrate de poner los campos exactos de tu entidad Organization
  const myOrg = orgRepo.create({
    name: 'Veterinaria Eric',
    // cuit: '20-12345678-9', <-- Si tienes este campo, actívalo
  });
  const savedOrg = await orgRepo.save(myOrg);
  console.log('Organización creada:', savedOrg.name);

  // 2. Crear el Usuario Admin vinculado
  const adminUser = userRepo.create({
    email: 'admin@vet.com',
    password: 'admin_password_123', // En el próximo sprint veremos hashing
    fullName: 'Eric Admin',
    organization: savedOrg, // Aquí se cumple la relación obligatoria
  });
  await userRepo.save(adminUser);
  console.log('Usuario Admin creado vinculado a la organización.');

  console.log('¡Seed completado con éxito! 🚀');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Error durante el Seed:', error);
  process.exit(1);
});