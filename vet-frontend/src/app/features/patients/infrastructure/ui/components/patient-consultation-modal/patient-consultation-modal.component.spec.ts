import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientConsultationModalComponent } from './patient-consultation-modal.component';

describe('PatientConsultationModalComponent', () => {
  let component: PatientConsultationModalComponent;
  let fixture: ComponentFixture<PatientConsultationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientConsultationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientConsultationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
