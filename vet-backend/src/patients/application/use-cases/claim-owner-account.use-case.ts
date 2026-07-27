// src/patients/application/use-cases/claim-owner-account.use-case.ts

import { 
  Injectable, 
  Inject, 
  NotFoundException, 
  BadRequestException, 
  ConflictException,
  InternalServerErrorException 
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { 
  IOwnerRepository, 
  OWNER_REPOSITORY_TOKEN 
} from '../../domain/ports/owner.repository.interface';
import { UsersService } from '../../../users/users.service';
import { UserRole } from '../../../users/entities/user.entity';
import { ClaimAccountDto } from '../../infrastructure/controllers/dtos/claim-account-dto';
import { OwnerOrmEntity } from '../../infrastructure/persistence/typeorm/entities/owner.orm-entity';

@Injectable()
export class ClaimOwnerAccountUseCase {
  constructor(
    @Inject(OWNER_REPOSITORY_TOKEN)
    private readonly ownerRepository: IOwnerRepository,
    private readonly userService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(dto: ClaimAccountDto) {
    // 1. Lectura y validaciones previas
    const owner = await this.ownerRepository.findByEmail(dto.email, dto.orgId);
    
    if (!owner) {
      throw new NotFoundException('No se encontró ninguna ficha de cliente asociada a este correo en la veterinaria.');
    }

    if (owner.hasAppAccount()) {
      throw new BadRequestException('Ya existe una cuenta de usuario vinculada a esta ficha de cliente.');
    }

    // 2. Ejecución Atómica (ACID Transaction)
    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      try {
        // Step A: Crear el usuario dentro de la transacción
        const newUser = await this.userService.createWithTransaction(
          {
            email: dto.email,
            password: dto.password,
            fullName: owner.getFullName(),
            role: UserRole.OWNER,
          },
          dto.orgId,
          transactionalEntityManager,
        );

        // Step B: Mutar el estado en la entidad de Dominio pura
        owner.linkUserAccount(newUser.id);

        // Step C: Persistir los cambios del Owner en la misma transacción
        await transactionalEntityManager.update(
          OwnerOrmEntity,
          { id: owner.getId(), orgId: owner.getOrgId() },
          { userId: owner.getUserId() },
        );

        return { 
          message: 'Cuenta vinculada exitosamente.', 
          userId: newUser.id 
        };
      } catch (error) {
        // Preservamos las excepciones HTTP conocidas
        if (
          error instanceof BadRequestException || 
          error instanceof NotFoundException ||
          error instanceof ConflictException
        ) {
          throw error;
        }
        throw new InternalServerErrorException('Error al intentar vincular la cuenta del cliente.');
      }
    });
  }
}