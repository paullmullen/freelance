import { TestBed } from '@angular/core/testing';

import { UtteranceService } from './utterance.service';

describe('UtteranceService', () => {
  let service: UtteranceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtteranceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
