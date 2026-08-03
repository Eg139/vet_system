import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-consultation-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-consultation-modal.component.html',
})
export class PatientConsultationModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  
  @Output() closeEvent = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();

  consultationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.consultationForm = this.fb.group({
      weight: ['', [Validators.required]],
      temperature: ['', [Validators.required]],
      heartRate: [''],
      respiratoryRate: [''],
      subjective: ['', [Validators.required]],
      objective: ['', [Validators.required]],
      assessment: ['', [Validators.required]],
      plan: ['', [Validators.required]],

      // Controles opcionales iniciales
      includeTreatment: [false],
      treatmentDescription: [''],
      includeVaccine: [false],
      vaccineName: ['']
    });
  }

  ngOnInit(): void {
    // 🛡️ Validación condicional para el Tratamiento
    this.consultationForm.get('includeTreatment')?.valueChanges.subscribe(isActive => {
      const control = this.consultationForm.get('treatmentDescription');
      if (isActive) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
        control?.setValue('');
      }
      control?.updateValueAndValidity();
    });

    // 🛡️ Validación condicional para la Vacuna
    this.consultationForm.get('includeVaccine')?.valueChanges.subscribe(isActive => {
      const control = this.consultationForm.get('vaccineName');
      if (isActive) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
        control?.setValue('');
      }
      control?.updateValueAndValidity();
    });
  }

  closeModal() {
    this.closeEvent.emit();
  }

  onSubmit() {
    if (this.consultationForm.valid) {
      this.formSubmit.emit(this.consultationForm.value);
      this.consultationForm.reset({
        includeTreatment: false,
        includeVaccine: false
      });
      this.closeModal();
    } else {
      // Si hay errores, marcamos todo como tocado para que la UI muestre las alertas visuales
      this.consultationForm.markAllAsTouched();
    }
  }

  toggleSection(section: 'treatment' | 'vaccine'): void {
    if (section === 'treatment') {
      const current = this.consultationForm.get('includeTreatment')?.value;
      this.consultationForm.get('includeTreatment')?.setValue(!current);
    } else {
      const current = this.consultationForm.get('includeVaccine')?.value;
      this.consultationForm.get('includeVaccine')?.setValue(!current);
    }
  }
}