import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredMembersComponent } from './expired-members.component';

describe('ExpiredMembersComponent', () => {
  let component: ExpiredMembersComponent;
  let fixture: ComponentFixture<ExpiredMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredMembersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiredMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
