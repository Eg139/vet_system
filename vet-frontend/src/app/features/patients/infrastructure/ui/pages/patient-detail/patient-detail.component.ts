import { Component, inject, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { GetPatientByIdUseCase } from '../../../../application/use-cases/get-patient-by-id.use-case';
import { UpdatePatientUseCase } from '../../../../application/use-cases/update-patient.use-case';
import { DeletePatientUseCase } from '../../../../application/use-cases/delete-patient.use-case'; // 👈 1. Importamos el caso de uso
import { Patient } from '../../../../domain/models/patient.model';
import { PatientVaccinesComponent } from '../../components/patient-vaccines/patient-vaccines.component';
import { PatientTreatmentsComponent } from '../../components/patient-treatments/patient-treatments.component';
import { PatientLaboratoryComponent } from '../../components/patient-laboratory/patient-laboratory.component';
import { PatientConsultationsComponent } from '../../components/patient-consultations/patient-consultations.component';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  
  imports: [
    CommonModule, 
    RouterLink, 
    PatientVaccinesComponent,
    PatientTreatmentsComponent,
    PatientLaboratoryComponent,
    PatientConsultationsComponent,
    TimelineComponent
  ],
  templateUrl: './patient-detail.component.html'
})
export class PatientDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly getPatientUseCase = inject(GetPatientByIdUseCase);
  private readonly updatePatientUseCase = inject(UpdatePatientUseCase);
  private readonly deletePatientUseCase = inject(DeletePatientUseCase); // 👈 2. Inyectamos el caso de uso

  readonly patientId = input.required<string>();

  patient$!: Observable<Patient | undefined>;
  activeTab: string = 'consultations';

  ngOnInit(): void {
    this.patient$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id')!;
        return this.getPatientUseCase.execute(id);
      })
    );
  }

  hasAllergies(patient: Patient): boolean {
    return patient.getChronicAllergies().length > 0;
  }

  onSaveChanges(formValues: any) {
    this.updatePatientUseCase.execute(this.patientId(), formValues).subscribe({
      next: (updatedPatient) => {
        console.log('Paciente actualizado con éxito:', updatedPatient);
      },
      error: (err) => console.error('Error al actualizar:', err)
    });
  }

  onEditPatient(patient: Patient): void {
    this.router.navigate(['/backoffice/patients/update', patient.getId()]);
  }

  // 👈 3. Método requerido por la plantilla para el botón de eliminar
  onDeletePatient(patient: Patient): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: `Se eliminará a ${patient.getName()} y todo su historial clínico.`,
    icon: 'warning',
    iconColor: '#fb7185', // rose-400
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    background: '#0f172a', // bg-slate-900
    color: '#f8fafc',      // text-slate-50
    confirmButtonColor: '#e11d48', // bg-rose-600
    cancelButtonColor: '#1e293b',  // bg-slate-800
    customClass: {
      popup: 'border border-slate-800 rounded-2xl shadow-2xl',
      title: 'text-lg font-bold text-slate-100',
      htmlContainer: 'text-sm text-slate-400',
      confirmButton: 'px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/20 transition hover:bg-rose-500',
      cancelButton: 'px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 transition hover:bg-slate-700'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.deletePatientUseCase.execute(patient.getId()).subscribe({
        next: (success) => {
          if (success) {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El paciente fue removido con éxito.',
              icon: 'success',
              iconColor: '#34d399', // emerald-400
              timer: 1500,
              showConfirmButton: false,
              background: '#0f172a',
              color: '#f8fafc',
              customClass: {
                popup: 'border border-slate-800 rounded-2xl shadow-2xl'
              }
            });
            this.router.navigate(['/backoffice/patients']);
          }
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  });
}
}