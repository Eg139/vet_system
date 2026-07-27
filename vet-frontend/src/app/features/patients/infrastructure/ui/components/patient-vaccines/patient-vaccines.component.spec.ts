import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVaccinesComponent } from './patient-vaccines.component';

describe('PatientVaccinesComponent', () => {
  let component: PatientVaccinesComponent;
  let fixture: ComponentFixture<PatientVaccinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientVaccinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientVaccinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
