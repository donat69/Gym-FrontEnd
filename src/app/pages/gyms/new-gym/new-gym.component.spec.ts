import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGymComponent } from './new-gym.component';

describe('NewGymComponent', () => {
  let component: NewGymComponent;
  let fixture: ComponentFixture<NewGymComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGymComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewGymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
