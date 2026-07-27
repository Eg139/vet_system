import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-consultation-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-consultation-modal.component.html',
})
export class PatientConsultationModalComponent {
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


      // 👈 NUEVOS CONTROLES PARA LAS SECCIONES OPCIONALES
      includeTreatment: [false],
      treatmentDescription: [''],
      includeVaccine: [false],
      vaccineName: ['']
    });
  }

  // Métodos que el HTML del modal está buscando:
  closeModal() {
    this.closeEvent.emit();
  }

  onSubmit() {
    if (this.consultationForm.valid) {
      this.formSubmit.emit(this.consultationForm.value);
      this.consultationForm.reset();
      this.closeModal();
    }
  }

  toggleSection(section: 'treatment' | 'vaccine'): void {
  if (section === 'treatment') {
    const current = this.consultationForm.get('includeTreatment')?.value;
    this.consultationForm.get('includeTreatment')?.setValue(!current);
    if (current) {
      this.consultationForm.get('treatmentDescription')?.setValue(''); // Limpia si lo cierra
    }
  } else {
    const current = this.consultationForm.get('includeVaccine')?.value;
    this.consultationForm.get('includeVaccine')?.setValue(!current);
    if (current) {
      this.consultationForm.get('vaccineName')?.setValue(''); // Limpia si lo cierra
    }
  }
}
}