import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVisitsComponent } from './list-visits.component';

describe('ListVisitsComponent', () => {
  let component: ListVisitsComponent;
  let fixture: ComponentFixture<ListVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListVisitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
