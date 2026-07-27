import { Observable } from 'rxjs';
import { TimelineEvent } from '../models/timeline-event.model';

export abstract class TimelineRepository {
  abstract getTimelineByPetId(petId: string): Observable<TimelineEvent[]>;
}