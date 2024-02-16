import { TestBed } from '@angular/core/testing';

import { ConstService } from './const.service';

describe('ConstService', () => {
  let service: ConstService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
