import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReporteTtlPacientesComponent } from './reporte-ttl-pacientes.component';

describe('ReporteTtlPacientesComponent', () => {
  let component: ReporteTtlPacientesComponent;
  let fixture: ComponentFixture<ReporteTtlPacientesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteTtlPacientesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteTtlPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
