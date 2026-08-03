import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultationRepository } from '../../../../domain/ports/consultation.repository';
import { RegisterTreatmentUseCase } from '../../../../application/use-cases/register-treatment.use-case';
import { RegisterVaccineUseCase } from '../../../../application/use-cases/register-vaccine.use-case';
import { Patient } from '../../../../domain/models/patient.model';
import { Consultation } from '../../../../domain/models/consultation.model';
import { PatientConsultationModalComponent } from '../patient-consultation-modal/patient-consultation-modal.component';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-consultations',
  standalone: true,
  imports: [
    CommonModule, 
    PatientConsultationModalComponent
  ],
  templateUrl: './patient-consultations.component.html',
})
export class PatientConsultationsComponent {
  @Input() patient!: Patient;

  private readonly consultationRepository = inject(ConsultationRepository);
  private readonly registerTreatmentUseCase = inject(RegisterTreatmentUseCase);
  private readonly registerVaccineUseCase = inject(RegisterVaccineUseCase);

  // Creamos una computed signal para extraer el ID de forma reactiva
  private readonly patientId = computed(() => this.patient?.getId());

  // Pasamos la señal directamente a toObservable()
  readonly consultations = toSignal(
    toObservable(this.patientId).pipe(
      switchMap(id => id ? this.consultationRepository.getByPetId(id) : [])
    ),
    { initialValue: [] }
  );

  isModalOpen = false;

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

onConsultationSubmit(val: any): void {
    if (this.patient && val.weight) {
      this.patient.registrarPesaje(Number(val.weight));
    }

    const newConsultation = new Consultation(
      Date.now().toString(),
      this.patient.getId(), 
      'Dr. Eric (Sesión Actual)',
      new Date(),
      val.subjective,
      `Temp: ${val.temperature}°C, FC: ${val.heartRate ?? 'N/D'} lpm, FR: ${val.respiratoryRate ?? 'N/D'} rpm. ${val.objective}`,
      val.assessment,
      val.plan
    );

    this.consultationRepository.addConsultation(newConsultation).subscribe({
      next: () => {
        // 🟢 1. Evaluamos el tratamiento de forma independiente
        if (val.includeTreatment && val.treatmentDescription) {
          this.registerTreatmentUseCase.execute({
            patientId: this.patient.getId(),
            consultationId: newConsultation.getId(),
            description: val.treatmentDescription
          }).subscribe();
        }

        // 🟢 2. Evaluamos la vacuna de forma independiente (¡Antes estaban atadas con && o faltaba ejecutarla!)
        if (val.includeVaccine && val.vaccineName) {
          this.registerVaccineUseCase.execute({
            patientId: this.patient.getId(),
            consultationId: newConsultation.getId(),
            vaccineName: val.vaccineName
          }).subscribe();
        }

        this.closeModal();
        
        // Alerta de éxito con SweetAlert2
        Swal.fire({
          title: '¡Evolución guardada!',
          text: 'La consulta SOAP y sus registros adicionales fueron procesados con éxito.',
          icon: 'success',
          iconColor: '#34d399',
          timer: 1500,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#f8fafc',
          customClass: { popup: 'border border-slate-800 rounded-2xl shadow-2xl' }
        });
      },
      error: (err: unknown) => {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al procesar la solicitud.';
        console.error('Error al guardar la consulta:', errorMessage);
      }
    });
  }
}