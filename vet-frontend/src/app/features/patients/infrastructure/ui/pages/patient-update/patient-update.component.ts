import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GetPatientByIdUseCase } from '../../../../application/use-cases/get-patient-by-id.use-case';
import { UpdatePatientUseCase } from '../../../../application/use-cases/update-patient.use-case';
import Swal from 'sweetalert2'; // 👈 Importamos SweetAlert2

@Component({
  selector: 'app-patient-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './patient-update.component.html'
})
export class PatientUpdateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  
  private readonly getPatientUseCase = inject(GetPatientByIdUseCase);
  private readonly updatePatientUseCase = inject(UpdatePatientUseCase);

  patientId!: string;
  isSubmitting = false;

  patientForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    species: ['', [Validators.required]],
    breed: ['', [Validators.required]],
    birthDate: [''],
    ownerName: ['', [Validators.required]],
    ownerPhone: ['', [Validators.required]],
    weightKg: [null, [Validators.min(0)]],
    bloodType: [''],
    isNeutered: [false]
  });

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id')!;
    
    if (this.patientId) {
      this.loadPatientData(this.patientId);
    }
  }

  private loadPatientData(id: string): void {
    this.getPatientUseCase.execute(id).subscribe({
      next: (patient) => {
        if (patient) {
          this.patientForm.patchValue({
            name: patient.getName(),
            species: patient.getSpecies(),
            breed: patient.getBreed(),
            birthDate: patient.getBirthDate() ? new Date(patient.getBirthDate()).toISOString().split('T')[0] : '',
            ownerName: patient.getOwnerName(),
            ownerPhone: patient.getOwnerPhone(),
            weightKg: patient.getWeight(),
            bloodType: patient.getBloodType(),
            isNeutered: patient.getIsNeutered()
          });
        }
      },
      error: (err) => console.error('Error al cargar paciente para editar:', err)
    });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.patientForm.value;

    const payload = {
      ...formValues,
      birthDate: formValues.birthDate ? new Date(formValues.birthDate) : undefined
    };

    this.updatePatientUseCase.execute(this.patientId, payload).subscribe({
      next: () => {
        // 🟢 Alerta flotante moderna de éxito acorde a la estética oscura de tu app
        Swal.fire({
          title: '¡Actualizado con éxito!',
          text: 'Los datos del paciente han sido guardados.',
          icon: 'success',
          iconColor: '#34d399',          // emerald-400
          timer: 1500,                   // Se oculta solo en 1.5 segundos
          showConfirmButton: false,
          background: '#0f172a',         // bg-slate-900
          color: '#f8fafc',              // text-slate-50
          customClass: {
            popup: 'border border-slate-800 rounded-2xl shadow-2xl',
            title: 'text-lg font-bold text-slate-100',
            htmlContainer: 'text-sm text-slate-400'
          }
        }).then(() => {
          // Redirigimos de vuelta al detalle del paciente
          this.router.navigate(['/backoffice/patients', this.patientId]);
        });
      },
      error: (err) => {
        console.error('Error al actualizar el paciente:', err);
        this.isSubmitting = false;

        // 🔴 Alerta de error si algo falla en el guardado
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron guardar los cambios. Inténtalo de nuevo.',
          icon: 'error',
          iconColor: '#fb7185',
          background: '#0f172a',
          color: '#f8fafc',
          confirmButtonColor: '#e11d48',
          customClass: {
            popup: 'border border-slate-800 rounded-2xl shadow-2xl',
            confirmButton: 'px-4 py-2 rounded-xl text-xs font-semibold'
          }
        });
      }
    });
  }
}