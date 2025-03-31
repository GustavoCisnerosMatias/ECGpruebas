import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { MedicoService } from 'src/app/servicios/medico.service';
import { PaisesService } from 'src/app/servicios/paises.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-crearmedicos',
  templateUrl: './crearmedicos.page.html',
  styleUrls: ['./crearmedicos.page.scss'],
})
export class CrearmedicosPage implements OnInit {
  verificacionMedico=0;
  paises: any[] = [];
  provincias: any[] = [];
  cantones: any[] = [];
  datos: any;
  usuariosGuardados: any[] = [];
  maxDate: string = '';
  minDate: string = '1940-01-01';
  showPassword: boolean = false;
  usuario: any = {
    nombre: '',
    apellido: '',
    cedula: '',
    fecha_nacimiento: '',
    correo_electronico: '',
    telefono: '',
    id_pais: '',
    id_provincia: '',
    id_canton: '',
    username: '',
    contrasena: '',
    id_rol: '3',
    estado: 'A',
    id_pais_origen:'',
    Genero: ''
  };

  tipoIdentificacion: 'cedula' | 'visa' | 'pasaporte' ='cedula';


  mensajeApi: string = '';
  constructor(
    private usuariosService: UsuariosService,
    private medicoService: MedicoService,

    private paisesService: PaisesService,
    private router: Router,
    private alertController: AlertController,
    private loading: LoadingController

  ) {}

  async ngOnInit() {
    await this.presentAlert('Para poder registrarse como Medico usted debe tener un titulo de tercer nivel registrado en "AGENCIA DE ASEGURAMIENTO DE LA CALIDAD DE LOS SERVICIOS DE SALUD Y MEDICINA PREPAGADA"');
    this.cargarPaises();
    this.seleccionarProvincias();
    this.setMaxDate();
    if (this.datos) {
      this.usuario = { ...this.datos };
    }
  }
  async funverificacionMedico(){
    let l = await this.loading.create();
    l.present();

    this.medicoService.verificaciondetitulos(this.usuario.cedula).subscribe({
      next: (response: any) => {
        console.log(response)
        if (response.titulo === 'Si') {
        console.log("response")
          this.usuario.nombre=response.nombres;
          this.usuario.apellido=response.apellidos;
          this.verificacionMedico=1;
          this.presentAlert('Bienvenid@ ' + this.usuario.nombre+" "+  this.usuario.apellido  );
        } else {
          this.presentAlert('No se encontro ningun titulo de 3 nivel registrado en   "AGENCIA DE ASEGURAMIENTO DE LA CALIDAD DE LOS SERVICIOS DE SALUD Y MEDICINA PREPAGADA" ');
        }
      },
      error: (err) => {

      }
    });
    l.dismiss();

  }
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Información Importante',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  setMaxDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.maxDate = `${year}-${month}-${day}`;
  }

  cargarPaises() {
    this.paisesService.obtenerPaises().subscribe(
      (data: { pais: { id_pais: number, nombre_pais: string }[] }) => {
        this.paises = data.pais;
       // console.log('Países cargados:', this.paises);
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
          console.error('Error al cargar las provincias', error);
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
          //console.log('Cantones cargados:', this.cantones);
        },
        (error) => {
          console.error('Error al cargar los cantones', error);
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


  validateNumericInput(event: any) {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
  }

  validateNameInput(event: any) {
    const input = event.target.value;
    event.target.value = input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  }
  validarCorreo(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }
  submitForm() {
    if (!this.validarCorreo(this.usuario.correo_electronico)) {
      //console.log("Correo electrónico inválido");
      // Puedes mostrar algún mensaje o manejar la validación
    } else {
      // Procesar el formulario si es válido
     // console.log("Formulario válido");
    }
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  longitudesMaximas = {
    cedula: 10,
    visa: 11,
    pasaporte: 9, // O el número que desees
  };
  mensajeError: string = '';

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


  onSubmit() {
    // Convertir nombre y apellido a mayúsculas
    this.usuario.nombre = this.usuario.nombre.toUpperCase();
    this.usuario.apellido = this.usuario.apellido.toUpperCase();
    this.usuario.Genero = this.usuario.Genero.toUpperCase();
    this.usuario.id_rol = '3';
    this.usuario.estado = 'A';
    this.usuario.id_pais = 1;
    this.usuario.username=this.usuario.cedula;

    // Añadir el usuario a la lista local de usuarios guardados
    this.usuariosGuardados.push({ ...this.usuario });

    // Llamar al servicio para crear el usuario
    this.usuariosService.crear_usuariomedico(this.usuario).subscribe({
      next: (response: any) => {
        // Capturar el mensaje y el id_usuario de la respuesta
        this.mensajeApi = response.mensaje;
        const id = response.id_usuario;

        // Verificar si el mensaje es "Usuario creado exitosamente"
        if (this.mensajeApi === 'Usuario creado exitosamente') {
         // console.log('Usuario creado con éxito, ID:', id);
          // Navegar a la página de datos del médico, pasando el id_usuario en los queryParams
          this.router.navigate(['/datosmedico'], { queryParams: { id_usuario: id } });
        } else {
          // Si el mensaje no coincide, mostrar una alerta con el mensaje de error
         // console.error('Error al crear el usuario:', this.mensajeApi);
          this.presentAlert(this.mensajeApi);
          this.router.navigate(['/autentificacion']);
        }
      },
      error: (err) => {
        /* console.error('Error al crear el usuario:', err);
        this.mensajeApi = 'Error al crear el usuario'; // Guardar mensaje de error en la propiedad
        this.presentAlert(this.mensajeApi);
        this.router.navigate(['/autentificacion']); */
      }
    });
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

  async verificarCorreo(correo_electronico: string): Promise<void> {
    if (correo_electronico) {
      const datosCorreo = { "correo_electronico": correo_electronico };
     // console.log(datosCorreo)// Prepara el objeto a enviar
      this.usuariosService.verificar_correo(datosCorreo).subscribe(
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
