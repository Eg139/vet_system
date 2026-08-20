import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { 
  IVaccineRepository, 
  VACCINE_REPOSITORY_TOKEN 
} from '../../domain/ports/vaccine.repository.interface';
import { VaccineEntity } from '../../domain/entities/vaccine.entity';

@Injectable()
export class GetVaccineByIdUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY_TOKEN)
    private readonly vaccineRepository: IVaccineRepository,
  ) {}

  async execute(id: string, orgId: string): Promise<VaccineEntity> {
    const vaccine = await this.vaccineRepository.findById(id, orgId);

    if (!vaccine) {
      throw new NotFoundException(`El registro de vacuna con ID "${id}" no fue encontrado.`);
    }

    return vaccine;
  }
}