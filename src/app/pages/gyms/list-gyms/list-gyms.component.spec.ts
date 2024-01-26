import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGymsComponent } from './list-gyms.component';

describe('ListGymsComponent', () => {
  let component: ListGymsComponent;
  let fixture: ComponentFixture<ListGymsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGymsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListGymsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
