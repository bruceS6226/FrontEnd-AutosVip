import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearRepuestoComponent } from './crear-repuesto.component';

describe('CrearRepuestoComponent', () => {
  let component: CrearRepuestoComponent;
  let fixture: ComponentFixture<CrearRepuestoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearRepuestoComponent]
    });
    fixture = TestBed.createComponent(CrearRepuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
