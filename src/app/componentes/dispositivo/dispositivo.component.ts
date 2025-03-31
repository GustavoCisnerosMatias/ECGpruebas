import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.component.html',
  styleUrls: ['./dispositivo.component.scss'],
})
export class DispositivoComponent {
  dispositivo: any = {
    codigo: '',
    nombre: '',
    estado: 'A'
  };
  constructor(private router: Router) {}

  aceptaCondiciones: boolean = false;
  aceptaPolitica: boolean = false;

  @Output() dispositivoCreado = new EventEmitter<any>();
  @Output() anterior = new EventEmitter<void>();
  @Input() datos: any;

  siguiente() {
    if (this.aceptaCondiciones && this.aceptaPolitica) {
      this.dispositivoCreado.emit(this.dispositivo);
    }
  }

  retroceder() {
    this.anterior.emit();
  }

  esFormularioValido() {
    return (
      this.dispositivo.codigo.trim() !== '' &&
      this.dispositivo.nombre.trim() !== '' &&
      this.aceptaCondiciones &&
      this.aceptaPolitica
    );
  }
  redirigirCondiciones() {
    this.router.navigate(['/proteciondedatos']);
  }

  redirigirPolitica() {
    this.router.navigate(['/politicas']);
  }
}
