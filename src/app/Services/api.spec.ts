import { TestBed } from '@angular/core/testing';

import { BuscadorPeliculasService } from './api.service';

describe('BuscadorPeliculasService', () => {
  let service: BuscadorPeliculasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscadorPeliculasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
