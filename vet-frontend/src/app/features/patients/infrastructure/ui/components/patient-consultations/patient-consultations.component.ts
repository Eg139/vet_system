import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultationRepository } from '../../../../domain/ports/consultation.repository';
import { ConsultationMemoryAdapter } from '../../../adapters/consultation-memory.adapter'; // 👈 1. Importa tu adaptador
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

  private readonly consultationRepository: ConsultationRepository = inject(ConsultationRepository);

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
      this.patient.getId(), // 👈 1. Asegúrate de pasar el ID del paciente aquí (o como prop del objeto)
      'Dr. Eric (Sesión Actual)',
      new Date(),
      val.subjective,
      `Temp: ${val.temperature}°C, FC: ${val.heartRate ?? 'N/D'} lpm, FR: ${val.respiratoryRate ?? 'N/D'} rpm. ${val.objective}`,
      val.assessment,
      val.plan
    );

    this.consultationRepository.addConsultation(newConsultation).subscribe({
      next: () => {
        this.closeModal();
        
        // 🟢 Opcional pero recomendado: ¡Añade tu toque de SweetAlert2 aquí!
        Swal.fire({
          title: '¡Evolución guardada!',
          text: 'La consulta SOAP fue registrada con éxito.',
          icon: 'success',
          iconColor: '#34d399',
          timer: 1500,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#f8fafc',
          customClass: { popup: 'border border-slate-800 rounded-2xl shadow-2xl' }
        });
      },
      error: (err) => {
        console.error('Error al guardar la consulta', err);
      }
    });
  }
}