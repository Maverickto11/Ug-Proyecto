import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarSeriesComponent } from './registrar-series.component';

describe('RegistrarSeriesComponent', () => {
  let component: RegistrarSeriesComponent;
  let fixture: ComponentFixture<RegistrarSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarSeriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
