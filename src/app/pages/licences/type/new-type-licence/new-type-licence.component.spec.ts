import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTypeLicenceComponent } from './new-type-licence.component';

describe('NewTypeLicenceComponent', () => {
  let component: NewTypeLicenceComponent;
  let fixture: ComponentFixture<NewTypeLicenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTypeLicenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTypeLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
