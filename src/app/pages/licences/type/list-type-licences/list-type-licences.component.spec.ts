import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeLicencesComponent } from './list-type-licences.component';

describe('ListTypeLicencesComponent', () => {
  let component: ListTypeLicencesComponent;
  let fixture: ComponentFixture<ListTypeLicencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTypeLicencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTypeLicencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
