import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrescriptionRepository, PRESCRIPTION_REPOSITORY_TOKEN } from '../../domain/ports/prescription.repository.interface';
import { PrescriptionEntity } from '../../domain/entities/prescription.entity';
import { IMedicalHistoryRepository, MEDICAL_HISTORY_REPOSITORY_TOKEN } from '../../../medical-history/domain/ports/medical-history.repository.interface';
import { IPetRepository, PET_REPOSITORY_TOKEN } from '../../../patients/domain/ports/pet.repository.interface';
import { IOwnerRepository, OWNER_REPOSITORY_TOKEN } from '../../../patients/domain/ports/owner.repository.interface';
import { getRegulatoryProfile } from '../../../common/config/regulatory-profiles';
import { randomUUID } from 'crypto';

interface CreatePrescriptionInput {
  consultationId: string;
  orgId: string;
  veterinarianName: string;
  countryCode?: string;
}

@Injectable()
export class CreatePrescriptionUseCase {
  constructor(
    @Inject(PRESCRIPTION_REPOSITORY_TOKEN)
    private readonly prescriptionRepository: PrescriptionRepository,
    @Inject(MEDICAL_HISTORY_REPOSITORY_TOKEN)
    private readonly medicalHistoryRepository: IMedicalHistoryRepository,
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petRepository: IPetRepository,
    @Inject(OWNER_REPOSITORY_TOKEN)
    private readonly ownerRepository: IOwnerRepository,
  ) {}

  async execute(input: CreatePrescriptionInput): Promise<PrescriptionEntity> {
    // 1. Validar que la consulta SOAP exista
    const consultation = await this.medicalHistoryRepository.findById(input.consultationId, input.orgId);
    if (!consultation) {
      throw new NotFoundException('La consulta SOAP asociada no existe.');
    }

    // 2. Obtener los datos oficiales de la mascota (Patient/Pet)
    const pet = await this.petRepository.findById(consultation.getPatientId(), input.orgId);
    if (!pet) {
      throw new NotFoundException('No se encontró el paciente asociado a la consulta.');
    }

    // 3. Obtener los datos del propietario responsable (Owner) usando el ownerId de la mascota
    // (Asumiendo que tu entidad Pet tiene un método para obtener el ownerId, ej: getOwnerId())
    const owner = await this.ownerRepository.findById(pet.getOwnerId(), input.orgId);
    const ownerNameInfo = owner ? owner.getFullName() : 'Propietario no especificado';

    // 4. Configuración regulatoria argentina
    const regulatoryConfig = getRegulatoryProfile(input.countryCode || 'AR');
    const formattedLicenseLabel = `${regulatoryConfig.licenseLabel}: [Pendiente]`;

    // 5. Construir la entidad de receta inmutable con los datos fehacientes
    const prescription = new PrescriptionEntity(
      randomUUID(),
      input.consultationId,
      input.orgId,
      pet.getName(),               // Nombre oficial de la mascota
      input.veterinarianName,
      formattedLicenseLabel,
      consultation.getAssessment(),
      consultation.getPlan(),
      new Date(),
    );

    // 6. Persistir para auditoría
    return await this.prescriptionRepository.save(prescription);
  }
}