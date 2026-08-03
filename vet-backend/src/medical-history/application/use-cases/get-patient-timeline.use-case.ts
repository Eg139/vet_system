import { Injectable, Inject } from '@nestjs/common';
import { 
  IMedicalHistoryRepository, 
  MEDICAL_HISTORY_REPOSITORY_TOKEN 
} from '../../domain/ports/medical-history.repository.interface';
import { MedicalHistoryTimelineItemDto } from '../../infrastructure/dtos/medical-history-timeline-item.dto';

@Injectable()
export class GetPatientTimelineUseCase {
  constructor(
    @Inject(MEDICAL_HISTORY_REPOSITORY_TOKEN)
    private readonly medicalHistoryRepository: IMedicalHistoryRepository,
  ) {}

  async execute(patientId: string, orgId: string): Promise<MedicalHistoryTimelineItemDto[]> {
    // 1. Obtenemos las consultas SOAP del repositorio
    const consultations = await this.medicalHistoryRepository.findByPatientId(patientId, orgId);

    // 2. Mapeamos cada consulta a un item estándar de la línea de tiempo
    const consultationItems: MedicalHistoryTimelineItemDto[] = consultations.map(consultation => {
      const item = new MedicalHistoryTimelineItemDto();
      item.id = consultation.getId();
      item.type = 'CONSULTATION';
      item.date = consultation.getCreatedAt();
      item.veterinarian = consultation.getVeterinarian();
      item.title = `Consulta Médica (SOAP)`;
      
      item.soapDetails = {
        subjective: consultation.getSubjective(),
        objective: consultation.getObjective(),
        assessment: consultation.getAssessment(),
        plan: consultation.getPlan(),
      };

      // Si tiene alguna constante vital registrada, la agregamos
      if (
        consultation.getWeight() !== undefined ||
        consultation.getTemperature() !== undefined ||
        consultation.getHeartRate() !== undefined ||
        consultation.getRespiratoryRate() !== undefined
      ) {
        item.vitals = {
          weight: consultation.getWeight() ?? undefined,
          temperature: consultation.getTemperature() ?? undefined,
          heartRate: consultation.getHeartRate() ?? undefined,
          respiratoryRate: consultation.getRespiratoryRate() ?? undefined,
        };
      }

      return item;
    });

    // A futuro, aquí harías lo mismo con vacunas, desparasitaciones, etc.:
    // const vaccines = await this.vaccineRepository.findByPatientId(patientId);
    // const vaccineItems = vaccines.map(...);

    // 3. Juntamos todo en un solo array y lo ordenamos por fecha descendiente (más reciente primero)
    const timeline = [...consultationItems]; // .concat(vaccineItems) cuando existan
    
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return timeline;
  }
}