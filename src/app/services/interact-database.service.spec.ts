import { TestBed } from '@angular/core/testing';

import { InteractDatabaseService } from './interact-database.service';

describe('InteractDatabaseService', () => {
  let service: InteractDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteractDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
