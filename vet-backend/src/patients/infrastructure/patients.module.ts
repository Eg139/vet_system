// src/patients/infrastructure/patients.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Persistencia e Infraestructura
import { PetOrmEntity } from './persistence/typeorm/entities/pet.orm-entity';
import { TypeOrmPetRepository } from './persistence/typeorm/repositories/typeorm-pet.repository';
import { PetController } from './controllers/pet.controller';

// Dominio (Puerto)
import { PET_REPOSITORY_TOKEN } from '../domain/ports/pet.repository.interface';

// Casos de Uso (Capa de Aplicación) - ¡Todos los 5 casos sincronizados!
import { CreatePetUseCase } from '../application/use-cases/create-pet.use-case';
import { UpdatePetUseCase } from '../application/use-cases/update-pet.use-case';
import { GetPetsByOwnerUseCase } from '../application/use-cases/get-pets-by-owner.use-case';
import { NeuterPetUseCase } from '../application/use-cases/neuter-pet.use-case';
import { TransferPetOwnershipUseCase } from '../application/use-cases/transfer-pet-ownership.use-case';

@Module({
  imports: [
    // Registramos la entidad en el alcance de TypeORM para este módulo
    TypeOrmModule.forFeature([PetOrmEntity]),
  ],
  controllers: [
    PetController, // <-- Clave para exponer las rutas hacia Angular y Swagger
  ],
  providers: [
    // El truco de magia de NestJS: vinculamos el Token con la implementación real de base de datos
    {
      provide: PET_REPOSITORY_TOKEN,
      useClass: TypeOrmPetRepository,
    },
    // Registramos TODOS nuestros Casos de Uso como providers para la inyección de dependencias
    CreatePetUseCase,
    UpdatePetUseCase,
    GetPetsByOwnerUseCase,
    NeuterPetUseCase,
    TransferPetOwnershipUseCase,
  ],
  // Exportamos los casos de uso por si el módulo de Historial Clínico o Turnos los necesita
  exports: [
    CreatePetUseCase,
    UpdatePetUseCase,
    GetPetsByOwnerUseCase,
    NeuterPetUseCase,
    TransferPetOwnershipUseCase,
  ],
})
export class PatientsModule {}