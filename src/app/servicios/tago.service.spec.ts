import { TestBed } from '@angular/core/testing';

import { TagoService } from './tago.service';

describe('TagoService', () => {
  let service: TagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
