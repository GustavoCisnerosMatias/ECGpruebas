import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodasalertasPage } from './todasalertas.page';

describe('TodasalertasPage', () => {
  let component: TodasalertasPage;
  let fixture: ComponentFixture<TodasalertasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TodasalertasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
