import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Importar AlertController
import { PaisesService } from 'src/app/servicios/paises.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-registraradministrador',
  templateUrl: './registraradministrador.page.html',
  styleUrls: ['./registraradministrador.page.scss'],
})
export class RegistraradministradorPage implements OnInit {

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
      id_rol: '2',
      estado: 'A',
      id_pais_origen:'',
      Genero:''
    };
    tipoIdentificacion: 'cedula' | 'visa' | 'pasaporte' ='cedula';

    constructor(
      private usuariosService: UsuariosService,
      private paisesService: PaisesService,
      private router: Router,
      private alertController: AlertController // Inyectar AlertController
    ) {}

    async ngOnInit() {
      await this.presentAlert('Registro solo para nuevo administrador');
      this.cargarPaises();
      this.seleccionarProvincias();
      this.setMaxDate();
      if (this.datos) {
        this.usuario = { ...this.datos };
      }
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
          //console.log('Países cargados:', this.paises);
        },
        (error) => {
          console.error('Error al cargar los países', error);
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
           // console.error('Error al cargar los cantones', error);
          }
        );
      } else {
        this.cantones = [];
      }
    }

    tipoIdentificacionChange(event: any) {
      this.tipoIdentificacion = event.detail.value;
     // console.log('Tipo de identificación cambiado a:', this.tipoIdentificacion);
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
  actualizarUsuario() {
    this.usuario.username = this.usuario.cedula;
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

    onSubmit() {
      this.usuario.nombre = this.usuario.nombre.toUpperCase();
      this.usuario.apellido = this.usuario.apellido.toUpperCase();
      this.usuario.id_rol = '2';
      this.usuario.estado = 'A';
      this.usuario.id_pais = 1;
      this.usuario.username=this.usuario.cedula;

     this.usuariosGuardados.push({ ...this.usuario });
      this.usuariosService.crearUsuario(this.usuario).subscribe({
        next: (response: any) => {
          // Mostrar el mensaje del servicio
          this.presentAlert(response.mensaje);

          // Verificar el mensaje para decidir si redirigir o no
          if (response.mensaje === 'Usuario creado exitosamente') {
            this.router.navigate(['/inicio']);
          }
          // Si el mensaje no es "Usuario creado exitosamente", no redirigir
        },
        error: (err) => {
         // console.error('Error al crear el usuario:', err);
          this.presentAlert('Error al crear el usuario'); // Mostrar un mensaje de error
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





  }
