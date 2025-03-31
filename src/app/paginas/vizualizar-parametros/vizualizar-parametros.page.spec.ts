import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VizualizarParametrosPage } from './vizualizar-parametros.page';

describe('VizualizarParametrosPage', () => {
  let component: VizualizarParametrosPage;
  let fixture: ComponentFixture<VizualizarParametrosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VizualizarParametrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
