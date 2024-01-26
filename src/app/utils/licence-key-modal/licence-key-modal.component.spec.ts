import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceKeyModalComponent } from './licence-key-modal.component';

describe('LicenceKeyModalComponent', () => {
  let component: LicenceKeyModalComponent;
  let fixture: ComponentFixture<LicenceKeyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenceKeyModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenceKeyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
