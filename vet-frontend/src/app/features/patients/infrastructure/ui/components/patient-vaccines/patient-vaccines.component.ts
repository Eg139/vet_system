import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vaccine } from '../../../../domain/models/vaccine.model';
import { GetPatientVaccinesUseCase } from '../../../../application/use-cases/get-patient-vaccines.use-case';
import { PatientVaccineRepository } from '../../../../domain/ports/patient-vaccine.repository';
import { PatientVaccineMemoryAdapter } from '../../../adapters/patient-vaccine-memory.adapter';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-patient-vaccines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-vaccines.component.html',
})
export class PatientVaccinesComponent {
  @Input() set patientId(id: string) {
    if (id) this._patientId.set(id);
  }

  private readonly _patientId = signal<string>('');
  private readonly getVaccinesUseCase = inject(GetPatientVaccinesUseCase);

  readonly vaccines = toSignal(
    toObservable(this._patientId).pipe(
      switchMap(id => id ? this.getVaccinesUseCase.execute(id) : of([])),
      catchError(err => {
        console.error('Error al cargar vacunas', err);
        return of([]);
      })
    ),
    { initialValue: [] }
  );
}