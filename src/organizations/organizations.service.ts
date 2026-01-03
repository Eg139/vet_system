import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
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
  private handleDBExceptions(error: any) {
    if (error.code === '23505') // Código de Postgres para "Unique violation"
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  findAll() {
    return `This action returns all organizations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
