import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLicenceComponent } from './new-licence.component';

describe('NewLicenceComponent', () => {
  let component: NewLicenceComponent;
  let fixture: ComponentFixture<NewLicenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLicenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
