// src/patients/infrastructure/patients.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulo externo necesario para autenticación/usuarios
import { UsersModule } from '../../users/users.module';

// Persistencia e Infraestructura
import { PetOrmEntity } from './persistence/typeorm/entities/pet.orm-entity';
import { OwnerOrmEntity } from './persistence/typeorm/entities/owner.orm-entity';
import { TypeOrmPetRepository } from './persistence/typeorm/repositories/typeorm-pet.repository';
import { TypeOrmOwnerRepository } from './persistence/typeorm/repositories/typeorm-owner.repository';

// Controladores
import { PetController } from './controllers/pet.controller';
import { OwnerController } from './controllers/owner.controller'; // 👈 Si tenés o creás este controller

// Dominio (Puertos/Tokens)
import { PET_REPOSITORY_TOKEN } from '../domain/ports/pet.repository.interface';
import { OWNER_REPOSITORY_TOKEN } from '../domain/ports/owner.repository.interface'; // 👈 Asegurate de definir este token o usar la abstract class directa

// Casos de Uso (Capa de Aplicación)
import { CreatePetUseCase } from '../application/use-cases/create-pet.use-case';
import { UpdatePetUseCase } from '../application/use-cases/update-pet.use-case';
import { GetPetsByOwnerUseCase } from '../application/use-cases/get-pets-by-owner.use-case';
import { NeuterPetUseCase } from '../application/use-cases/neuter-pet.use-case';
import { TransferPetOwnershipUseCase } from '../application/use-cases/transfer-pet-ownership.use-case';
import { GetPetByIdUseCase } from '../application/use-cases/get-pet-by-id.use-case';
import { ClaimOwnerAccountUseCase } from '../application/use-cases/claim-owner-account.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([PetOrmEntity, OwnerOrmEntity]),
    UsersModule, // 👈 Clave para que ClaimOwnerAccountUseCase pueda llamar a UsersService
  ],
  controllers: [
    PetController,
    OwnerController, // 👈 Para exponer el endpoint POST /owners/claim-account hacia Angular
  ],
  providers: [
    // Inyección por Tokens para desacoplar infraestructura
    {
      provide: PET_REPOSITORY_TOKEN,
      useClass: TypeOrmPetRepository,
    },
    {
      provide: OWNER_REPOSITORY_TOKEN, // O 'OwnerRepository' si usaste la abstract class directa
      useClass: TypeOrmOwnerRepository,
    },

    // Registramos TODOS los Casos de Uso
    CreatePetUseCase,
    UpdatePetUseCase,
    GetPetsByOwnerUseCase,
    NeuterPetUseCase,
    TransferPetOwnershipUseCase,
    GetPetByIdUseCase,
    ClaimOwnerAccountUseCase, // 👈 Registrado
  ],
  exports: [
    CreatePetUseCase,
    UpdatePetUseCase,
    GetPetsByOwnerUseCase,
    NeuterPetUseCase,
    TransferPetOwnershipUseCase,
    GetPetByIdUseCase,
    ClaimOwnerAccountUseCase, // 👈 Exportado por si se requiere externamente
  ],
})
export class PatientsModule {}