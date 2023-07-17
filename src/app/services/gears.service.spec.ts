import { TestBed } from '@angular/core/testing';

import { GearsService } from './gears.service';

describe('GearsService', () => {
  let service: GearsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GearsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
