import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelemedicinaPage } from './telemedicina.page';

describe('TelemedicinaPage', () => {
  let component: TelemedicinaPage;
  let fixture: ComponentFixture<TelemedicinaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemedicinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
