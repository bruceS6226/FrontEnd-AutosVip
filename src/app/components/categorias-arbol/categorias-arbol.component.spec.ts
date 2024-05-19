import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasArbolComponent } from './categorias-arbol.component';

describe('CategoriasArbolComponent', () => {
  let component: CategoriasArbolComponent;
  let fixture: ComponentFixture<CategoriasArbolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriasArbolComponent]
    });
    fixture = TestBed.createComponent(CategoriasArbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
