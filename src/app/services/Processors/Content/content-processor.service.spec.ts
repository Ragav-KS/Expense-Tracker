import { TestBed } from '@angular/core/testing';

import { ContentProcessorService } from './content-processor.service';

describe('ContentProcessorService', () => {
  let service: ContentProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
