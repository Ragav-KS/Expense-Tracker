import { TestBed } from '@angular/core/testing';

import { PreferenceStoreService } from './preference-store.service';

describe('PreferenceStoreService', () => {
  let service: PreferenceStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreferenceStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
