import { TestBed } from '@angular/core/testing';

import { SerAutentificacionService } from './ser-autentificacion.service';

describe('SerAutentificacionService', () => {
  let service: SerAutentificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerAutentificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
