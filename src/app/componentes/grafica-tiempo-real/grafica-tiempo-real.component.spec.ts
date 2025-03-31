import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GraficaTiempoRealComponent } from './grafica-tiempo-real.component';

describe('GraficaTiempoRealComponent', () => {
  let component: GraficaTiempoRealComponent;
  let fixture: ComponentFixture<GraficaTiempoRealComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficaTiempoRealComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GraficaTiempoRealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
