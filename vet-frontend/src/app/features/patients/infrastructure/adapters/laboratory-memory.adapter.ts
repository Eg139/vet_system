import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LaboratoryRepository } from '../../domain/ports/laboratory.repository';
import { LaboratoryRecord } from '../../domain/models/laboratory-record.model';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryMemoryAdapter implements LaboratoryRepository {
  
  private mockRecords: LaboratoryRecord[] = [
    new LaboratoryRecord(
      'lab-1',
      '1', // Thor
      'Hemograma y Bioquímica Sanguínea',
      'LABORATORY',
      new Date('2026-03-08'),
      'Dra. Gómez M.',
      'Parámetros dentro de rangos normales. Leve aumento de fosfatasa alcalina en control de rutina.',
      '#'
    ),
    new LaboratoryRecord(
      'img-1',
      '1',
      'Radiografía de Tórax (VD / Lateral)',
      'IMAGING',
      new Date('2026-02-15'),
      'Dra. Gómez M.',
      'Silueta cardiaca de tamaño normal. Tramberculo pulmonar limpio, sin patologías aparentes.',
      '#'
    )
  ];

  getRecordsByPatientId(patientId: string): Observable<LaboratoryRecord[]> {
    const records = this.mockRecords.filter(r => r.getPatientId() === patientId);
    return of(records);
  }

  save(record: LaboratoryRecord): Observable<void> {
    this.mockRecords.push(record);
    return of(void 0);
  }
}