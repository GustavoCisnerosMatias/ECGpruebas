import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoalertaPage } from './tipoalerta.page';

describe('TipoalertaPage', () => {
  let component: TipoalertaPage;
  let fixture: ComponentFixture<TipoalertaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoalertaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
