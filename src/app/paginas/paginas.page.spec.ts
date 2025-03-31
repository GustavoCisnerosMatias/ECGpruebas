import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginasPage } from './paginas.page';

describe('PaginasPage', () => {
  let component: PaginasPage;
  let fixture: ComponentFixture<PaginasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
