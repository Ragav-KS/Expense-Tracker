import { TestBed } from '@angular/core/testing';

import { MailProcessorService } from './mail-processor.service';

describe('MailProcessorService', () => {
  let service: MailProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
