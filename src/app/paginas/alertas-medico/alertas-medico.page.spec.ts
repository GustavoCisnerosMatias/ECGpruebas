import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertasMedicoPage } from './alertas-medico.page';

describe('AlertasMedicoPage', () => {
  let component: AlertasMedicoPage;
  let fixture: ComponentFixture<AlertasMedicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertasMedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
