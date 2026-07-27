import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetPatientsUseCase } from '../../../../application/use-cases/get-patients.use-case';
import { PatientRepository } from '../../../../domain/ports/patient.repository';
import { PatientMemoryAdapter } from '../../../adapters/patient-memory.adapter';
import { Patient } from '../../../../domain/models/patient.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-list.component.html',
})
export class PatientsListComponent implements OnInit {
  patients: Patient[] = [];
  
  private readonly getPatientsUseCase = inject(GetPatientsUseCase);

  ngOnInit(): void {
    this.getPatientsUseCase.execute().subscribe(data => {
      this.patients = data;
    });
  }

  getNeuteredBadgeClasses(isNeutered: boolean): string {
    if (isNeutered) {
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
    return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  }
}