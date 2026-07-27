import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetActiveTreatmentsUseCase } from '../../../../application/use-cases/get-active-treatments.use-case';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, catchError } from 'rxjs';
import { of } from 'rxjs';
import { TreatmentRepository } from '../../../../domain/ports/treatment.repository';
import { TreatmentMemoryAdapter } from '../../../adapters/treatment-memory.adapter';


@Component({
  selector: 'app-patient-treatments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-treatments.component.html',
  styles: ``
})
export class PatientTreatmentsComponent {
  // Convertimos el Input en una Signal interna
  @Input() set patientId(id: string) {
    if (id) {
      this._patientId.set(id);
    }
  }

  private readonly getTreatmentsUseCase = inject(GetActiveTreatmentsUseCase);
  private readonly _patientId = signal<string>('');

  // Señal reactiva que se actualiza sola cada vez que cambia el patientId
  readonly treatments = toSignal(
    toObservable(this._patientId).pipe(
      switchMap(id => {
        if (!id) return of([]);
        return this.getTreatmentsUseCase.execute(id).pipe(
          catchError(err => {
            console.error('Error al cargar los tratamientos activos', err);
            return of([]);
          })
        );
      })
    ),
    { initialValue: [] }
  );
}