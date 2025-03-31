import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarUsernamePage } from './recuperar-username.page';

describe('RecuperarUsernamePage', () => {
  let component: RecuperarUsernamePage;
  let fixture: ComponentFixture<RecuperarUsernamePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarUsernamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
