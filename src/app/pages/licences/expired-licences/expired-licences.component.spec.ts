import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredLicencesComponent } from './expired-licences.component';

describe('ExpiredLicencesComponent', () => {
  let component: ExpiredLicencesComponent;
  let fixture: ComponentFixture<ExpiredLicencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredLicencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiredLicencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
