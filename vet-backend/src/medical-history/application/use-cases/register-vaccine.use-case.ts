import { Injectable, Inject } from '@nestjs/common';
import { 
  IVaccineRepository, 
  VACCINE_REPOSITORY_TOKEN 
} from '../../domain/ports/vaccine.repository.interface';
import { VaccineEntity } from '../../domain/entities/vaccine.entity';
import { RegisterVaccineHttpDto } from '../../infrastructure/dtos/register-vaccine.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class RegisterVaccineUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY_TOKEN)
    private readonly vaccineRepository: IVaccineRepository,
  ) {}

  async execute(params: {
    patientId: string;
    orgId: string;
    administeredBy: string;
    dto: RegisterVaccineHttpDto;
  }): Promise<VaccineEntity> {
    const { patientId, orgId, administeredBy, dto } = params;

    const vaccine = new VaccineEntity(
      randomUUID(),
      patientId,
      orgId,
      dto.vaccineName,
      dto.batchNumber,
      administeredBy,
      new Date(dto.applicationDate),
      dto.nextDueDate ? new Date(dto.nextDueDate) : undefined,
      dto.notes,
      new Date(),
    );

    return await this.vaccineRepository.save(vaccine);
  }
}