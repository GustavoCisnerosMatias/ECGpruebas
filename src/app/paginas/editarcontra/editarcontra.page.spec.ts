import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarcontraPage } from './editarcontra.page';

describe('EditarcontraPage', () => {
  let component: EditarcontraPage;
  let fixture: ComponentFixture<EditarcontraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarcontraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
