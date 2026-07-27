import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { GetPatientTimelineUseCase } from '../../../../application/use-cases/get-patient-timeline.use-case'; // 👈 Usamos el caso de uso

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
})
export class TimelineComponent {
  @Input() set petId(id: string) {
    this._petId.set(id);
  }

  private readonly getTimelineUseCase = inject(GetPatientTimelineUseCase); // 👈 Inyectamos el caso de uso
  private readonly _petId = signal<string>('1'); 

  readonly timelineEvents = toSignal(
    toObservable(this._petId).pipe(
      switchMap(id => this.getTimelineUseCase.execute(id)) // 👈 Llamamos al caso de uso
    ),
    { initialValue: [] }
  );
}