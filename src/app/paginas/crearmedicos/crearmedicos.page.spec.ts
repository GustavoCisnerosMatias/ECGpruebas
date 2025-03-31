import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearmedicosPage } from './crearmedicos.page';

describe('CrearmedicosPage', () => {
  let component: CrearmedicosPage;
  let fixture: ComponentFixture<CrearmedicosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearmedicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
