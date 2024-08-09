import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMovieComponent } from './detalle-movie.component';

describe('DetalleMovieComponent', () => {
  let component: DetalleMovieComponent;
  let fixture: ComponentFixture<DetalleMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMovieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
