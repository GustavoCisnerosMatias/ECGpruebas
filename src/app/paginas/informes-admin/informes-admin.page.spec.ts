import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformesAdminPage } from './informes-admin.page';

describe('InformesAdminPage', () => {
  let component: InformesAdminPage;
  let fixture: ComponentFixture<InformesAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InformesAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
