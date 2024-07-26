import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorPeliculasComponent } from './buscador-peliculas.component';

describe('BuscadorPeliculasComponent', () => {
  let component: BuscadorPeliculasComponent;
  let fixture: ComponentFixture<BuscadorPeliculasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorPeliculasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuscadorPeliculasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
