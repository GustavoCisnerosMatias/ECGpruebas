import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformesAdminMedicosComponent } from './informes-admin-medicos.component';

describe('InformesAdminMedicosComponent', () => {
  let component: InformesAdminMedicosComponent;
  let fixture: ComponentFixture<InformesAdminMedicosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InformesAdminMedicosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InformesAdminMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
