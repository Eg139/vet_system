import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {

  private readonly logger = new Logger('OrganizationsService');
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    try {
      // 1. Creamos la instancia de la entidad
      const organization = this.organizationRepository.create(createOrganizationDto);
      // 2. La guardamos en Postgres
      return await this.organizationRepository.save(organization);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    return await this.organizationRepository.find();
  }

  async findOne(id: string) { // 👈 Cambiado a string (UUID)
    const organization = await this.organizationRepository.findOneBy({ id });
    if (!organization) {
      throw new NotFoundException(`Organización con ID ${id} no encontrada`);
    }
    return organization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) { // 👈 Cambiado a string
    // Buscamos primero para asegurar que existe
    const organization = await this.findOne(id);
    
    // Actualizamos combinando datos
    const updated = Object.assign(organization, updateOrganizationDto);
    
    try {
      return await this.organizationRepository.save(updated);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) { // 👈 Cambiado a string
    const organization = await this.findOne(id);
    await this.organizationRepository.remove(organization);
    return { message: `Organización con ID ${id} eliminada exitosamente` };
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') // Código de Postgres para "Unique violation"
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}