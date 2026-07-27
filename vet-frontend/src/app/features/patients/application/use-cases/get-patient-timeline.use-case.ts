import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TimelineEvent } from '../../domain/models/timeline-event.model';
import { TimelineRepository } from '../../domain/ports/timeline.repository';

@Injectable({
  providedIn: 'root'
})
export class GetPatientTimelineUseCase {
  private readonly timelineRepository: TimelineRepository = inject(TimelineRepository);

  execute(petId: string): Observable<TimelineEvent[]> {
    return this.timelineRepository.getTimelineByPetId(petId);
  }
}