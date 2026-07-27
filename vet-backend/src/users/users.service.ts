// src/users/users.service.ts

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 1. Crear un usuario dentro de la organización activa
  async create(createUserDto: CreateUserDto, orgId: string) {
    const existingUser = await this.userRepository.findOne({
      where: { 
        email: createUserDto.email,
        organization: { id: orgId },
      },
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado en esta organización.');
    }

    // 🔒 Hashing explícito y predecible antes de persistir
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.SALT_ROUNDS,
    );

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.VET,
      organization: { id: orgId },
    });

    const savedUser = await this.userRepository.save(newUser);

    // Ocultamos el hash en la respuesta HTTP
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  // 2. Listar solo los usuarios de ESTA organización
  async findAll(orgId: string) {
    return await this.userRepository.find({
      where: { organization: { id: orgId } },
      select: ['id', 'email', 'fullName', 'role'], // Previene fuga de contraseñas
    });
  }

  // 3. Obtener un usuario específico (aislado por tenant)
  async findOne(id: string, orgId: string) {
    const user = await this.userRepository.findOne({
      where: { id, organization: { id: orgId } },
      select: ['id', 'email', 'fullName', 'role'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario no encontrado.`);
    }

    return user;
  }

  // 4. Actualizar usuario de forma explícita y segura
  async update(id: string, updateUserDto: UpdateUserDto, orgId: string) {
    // Garantiza existencia y pertenencia al tenant
    const user = await this.findOne(id, orgId);

    const updatePayload: Partial<CreateUserDto> = { ...updateUserDto };

    // 🔒 Si enviaron nueva contraseña, la hasheamos explícitamente
    if (updateUserDto.password) {
      updatePayload.password = await bcrypt.hash(
        updateUserDto.password,
        this.SALT_ROUNDS,
      );
    }

    // Fusionamos los cambios sobre la entidad existente
    const updatedUser = this.userRepository.merge(user, updatePayload);
    const savedUser = await this.userRepository.save(updatedUser);

    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  // 5. Eliminar usuario (aislado por tenant)
  async remove(id: string, orgId: string) {
    const user = await this.findOne(id, orgId);
    await this.userRepository.remove(user);
    return { message: 'Usuario eliminado con éxito.' };
  }

  // 6. Crear un usuario dentro de una transacción activa (ACID)
  async createWithTransaction(
    createUserDto: CreateUserDto, 
    orgId: string, 
    entityManager: EntityManager
  ) {
    // Validación de duplicados dentro de la misma transacción
    const existingUser = await entityManager.findOne(User, {
      where: { 
        email: createUserDto.email,
        organization: { id: orgId },
      },
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado en esta organización.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, this.SALT_ROUNDS);

    // Asignación de la relación mediante la clave foránea sin query extra
    const user = entityManager.create(User, {
      email: createUserDto.email,
      password: hashedPassword,
      fullName: createUserDto.fullName,
      role: createUserDto.role || UserRole.OWNER,
      organization: { id: orgId },
    });

    return await entityManager.save(User, user);
  }

  // 7. Buscar usuario trayendo el hash de contraseña (para Login/Auth)
  async findByEmailWithPassword(email: string, orgId: string): Promise<User | null> {
    return this.userRepository // 👈 Corregido: userRepository (singular)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .addSelect('user.password') // 👈 Trae el hash de forma explícita
      .where('user.email = :email', { email })
      .andWhere('organization.id = :orgId', { orgId })
      .getOne();
  }
}