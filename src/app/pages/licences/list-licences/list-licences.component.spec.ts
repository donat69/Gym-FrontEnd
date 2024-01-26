import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLicencesComponent } from './list-licences.component';

describe('ListLicencesComponent', () => {
  let component: ListLicencesComponent;
  let fixture: ComponentFixture<ListLicencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLicencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLicencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
