import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMembershipsComponent } from './list-memberships.component';

describe('ListMembershipsComponent', () => {
  let component: ListMembershipsComponent;
  let fixture: ComponentFixture<ListMembershipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMembershipsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMembershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
