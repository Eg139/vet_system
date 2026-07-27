import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Capa de Aplicación (Única dependencia de negocio que necesita el componente)
import { CreatePatientUseCase } from '../../../../application/use-cases/create-patient.use-case';

@Component({
  selector: 'app-patient-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-create.component.html',
})
export class PatientCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly createPatientUseCase = inject(CreatePatientUseCase);
  private readonly router = inject(Router);

  patientForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    species: ['', Validators.required],
    breed: ['', Validators.required],
    birthDate: [null],
    weightKg: [0, [Validators.min(0)]],
    ownerName: ['', Validators.required],
    ownerPhone: ['', Validators.required],
    bloodType: ['Desconocido'],
    isDonor: [false]
  });

  onSubmit(): void {
    if (this.patientForm.invalid) return;

    const formValues = this.patientForm.value;
    const patientData = {
      ...formValues,
      birthDate: formValues.birthDate ? new Date(formValues.birthDate) : undefined,
      allergies: []
    };

    this.createPatientUseCase.execute(patientData).subscribe({
      next: () => {
        this.router.navigate(['/backoffice/patients']);
      },
      error: (err) => console.error('Error al registrar paciente:', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/backoffice/patients']);
  }
}