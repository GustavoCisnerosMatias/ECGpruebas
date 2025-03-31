import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialMediPaciPage } from './historial-medi-paci.page';

describe('HistorialMediPaciPage', () => {
  let component: HistorialMediPaciPage;
  let fixture: ComponentFixture<HistorialMediPaciPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialMediPaciPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
