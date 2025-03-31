import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PaisesService } from 'src/app/servicios/paises.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss'],
})
export class CrearUsuarioComponent implements OnInit {
  @Output() usuarioCreado = new EventEmitter<any>();
  @Input() datos: any;
  @Output() anterior = new EventEmitter<void>();

  usuario: any = {
    nombre: '',
    apellido: '',
    cedula: '',
    fecha_nacimiento: '',
    correo_electronico: '',
    telefono: '',
    username: '',
    contrasena: '',
    id_rol: '1',
    estado: 'A',
    id_pais_origen:'',
    Genero: ''
  };

  tipoIdentificacion: 'cedula' | 'visa' | 'pasaporte' ='cedula';


  paises: any[] = [];
  provincias: any[] = [];
  cantones: any[] = [];
  maxDate: string = '';
  minDate: string = '1940-01-01';
  showPassword: boolean = false;

  constructor( private usuarioService: UsuariosService , private alertController: AlertController,private paisesService: PaisesService, private router: Router) {}

  ngOnInit() {
    this.seleccionarProvincias();
    this.cargarPaises();
    this.setMaxDate();
    if (this.datos) {
      this.usuario = { ...this.datos };
    }
  }

  setMaxDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.maxDate = `${year}-${month}-${day}`;
  }
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Información Importante',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  cargarPaises() {
    this.paisesService.obtenerPaises().subscribe(
      (data: { pais: { id_pais: number, nombre_pais: string }[] }) => {
        this.paises = data.pais;
      },
      (error) => {
        //console.error('Error al cargar los países', error);
      }
    );
  }

  seleccionarProvincias() {
    const id_pais = 1;
    if (id_pais) {
      this.paisesService.obtenerProvincias(id_pais).subscribe(
        (data: { provincias: { id_provincia: number, nombre_provincia: string }[] }) => {
          this.provincias = data.provincias;
        },
        (error) => {
          //console.error('Error al cargar las provincias', error);
        }
      );
    } else {
      this.provincias = [];
    }
  }




  seleccionarCantones() {
    if (this.usuario.id_provincia) {
      this.paisesService.obtenerCantones(this.usuario.id_provincia).subscribe(
        (data: { cantones: { id_canton: number, nombre_canton: string }[] }) => {
          this.cantones = data.cantones;
        },
        (error) => {
         // console.error('Error al cargar los cantones', error);
        }
      );
    } else {
      this.cantones = [];
    }
  }
  tipoIdentificacionChange(event: any) {
    this.tipoIdentificacion = event.detail.value;
    //console.log('Tipo de identificación cambiado a:', this.tipoIdentificacion);
    this.usuario.cedula = ''; // Reiniciar el campo
  }


  onTipoIdentificacionChange() {
    this.usuario.cedula = ''; // Reinicia el campo
    //console.log('Tipo de identificación cambiado a:', this.tipoIdentificacion);
  }
  longitudesMaximas = {
    cedula: 10,
    visa: 11,
    pasaporte: 9, // O el número que desees
  };
  mensajeError: string = '';



  registrarUsuario() {

    this.usuario.id_rol = '1';
    this.usuario.estado = 'A';


    this.usuario.nombre = this.usuario.nombre.toUpperCase();
    this.usuario.apellido = this.usuario.apellido.toUpperCase();
    this.usuario.Genero = this.usuario.Genero.toUpperCase();
    this.usuario.username=this.usuario.cedula;


    // Verificar si todos los campos requeridos están completos
    if (!this.validarDatosUsuario()) {
      alert('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }

    // Emitir datos de usuario al componente padre
    this.usuarioCreado.emit(this.usuario);
  }
  validarIdentificacion() {
    if (!this.tipoIdentificacion) {
      this.mensajeError = 'Por favor, seleccione un tipo de identificación.';
      return;
    }

    const longitudMaxima = this.longitudesMaximas[this.tipoIdentificacion];

    // Validar longitud
    if (this.usuario.cedula.length > longitudMaxima) {
      this.mensajeError = `La ${this.tipoIdentificacion} no debe tener más de ${longitudMaxima} dígitos.`;
      return;
    }

    let validacionCedula: boolean;

    // Validar según el tipo de identificación
    if (this.tipoIdentificacion === 'cedula') {
      validacionCedula = this.validarCedula(this.usuario.cedula);
      if (!validacionCedula) {
        this.mensajeError = 'La cédula ingresada no es válida.';
        return;
      }
    } else if (this.tipoIdentificacion === 'visa') {
      validacionCedula = this.usuario.cedula.length === 11;
      if (!validacionCedula) {
        this.mensajeError = 'La Visa debe tener 11 dígitos.';
        return;
      }
    } else if (this.tipoIdentificacion === 'pasaporte') {
      validacionCedula = this.usuario.cedula.length >= 8;
      if (!validacionCedula) {
        this.mensajeError = 'El Pasaporte debe tener al menos 8 caracteres.';
        return;
      }
    }

    // Limpiar el mensaje de error si es válido
    this.mensajeError = '';
  }




  validateNumericInput(event: any) {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
  }

  validateNameInput(event: any) {
    const input = event.target.value;
    event.target.value = input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  }

  validarCedula(cedula: string): boolean {
    // Validar que la longitud sea exactamente 10
    if (cedula.length !== 10) return false;

    const digitos = cedula.split('').map(Number);
    const provincia = parseInt(cedula.substring(0, 2), 10); // Primeros dos dígitos de la provincia

    // Validar que la provincia esté entre 1 y 24 (para provincias de Ecuador)
    if (provincia < 1 || provincia > 24) return false;

    // Cálculo del dígito verificador
    const suma = digitos.slice(0, 9).reduce((acc, num, index) => {
      if (index % 2 === 0) { // Índices pares (posiciones impares)
        const doble = num * 2;
        return acc + (doble > 9 ? doble - 9 : doble);
      }
      return acc + num; // Índices impares (posiciones pares)
    }, 0);

    const digitoVerificador = (10 - (suma % 10)) % 10;

    // Comparar con el último dígito de la cédula
    return digitoVerificador === digitos[9];
  }

  validarDatosUsuario(): boolean {
    // Verificar que todos los campos estén completos y que el correo sea válido
    return (
      this.usuario.nombre &&
      this.usuario.apellido &&
      this.usuario.fecha_nacimiento &&
      this.usuario.correo_electronico.trim() !== '' &&
      this.validarCorreo(this.usuario.correo_electronico) &&
      this.usuario.telefono &&
      this.usuario.telefono.length === 10 &&
      this.usuario.id_pais_origen &&
      this.usuario.contrasena.length >= 8 &&
      this.usuario.Genero

    );
  }

  validarCorreo(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  async verificarCorreo(correo_electronico: string): Promise<void> {
    if (correo_electronico) {
      const datosCorreo = { "correo_electronico": correo_electronico };
      //console.log(datosCorreo)// Prepara el objeto a enviar
      this.usuarioService.verificar_correo(datosCorreo).subscribe(
        async (respuesta) => {
          if (respuesta.mensaje) {
            await this.mostrarAlerta(respuesta.mensaje); // Muestra la alerta si existe el mensaje
          }
        },
        (error) => {
          console.error('Error al verificar correo:', error);
        }
      );
    }
  }
  async mostrarAlerta(mensaje: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }



}





