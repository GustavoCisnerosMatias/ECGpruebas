import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarUserPage } from './cambiar-user.page';

describe('CambiarUserPage', () => {
  let component: CambiarUserPage;
  let fixture: ComponentFixture<CambiarUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
