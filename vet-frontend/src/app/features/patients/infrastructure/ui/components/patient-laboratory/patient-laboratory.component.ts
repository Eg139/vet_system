import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaboratoryRecord } from '../../../../domain/models/laboratory-record.model';
import { GetPatientLaboratoryUseCase } from '../../../../application/use-cases/get-patient-laboratory.use-case';
import { LaboratoryRepository } from '../../../../domain/ports/laboratory.repository'; // 👈 1. Importa el puerto abstracto
import { LaboratoryMemoryAdapter } from '../../../adapters/laboratory-memory.adapter'; // 👈 2. Importa tu adaptador (ajusta la ruta según tus carpetas)
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-patient-laboratory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-laboratory.component.html',
})
export class PatientLaboratoryComponent {
  @Input() set patientId(id: string) {
    if (id) this._patientId.set(id);
  }

  private readonly _patientId = signal<string>('');
  private readonly getLaboratoryUseCase = inject(GetPatientLaboratoryUseCase);

  readonly records = toSignal(
    toObservable(this._patientId).pipe(
      switchMap(id => id ? this.getLaboratoryUseCase.execute(id) : of([])),
      catchError(err => {
        console.error('Error al cargar laboratorios e imágenes', err);
        return of([]);
      })
    ),
    { initialValue: [] }
  );
}