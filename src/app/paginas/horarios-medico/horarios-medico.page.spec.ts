import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HorariosMedicoPage } from './horarios-medico.page';

describe('HorariosMedicoPage', () => {
  let component: HorariosMedicoPage;
  let fixture: ComponentFixture<HorariosMedicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HorariosMedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
