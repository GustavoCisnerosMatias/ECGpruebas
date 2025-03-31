import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from 'src/app/servicios/paciente.service';
import { ParametrosService } from 'src/app/servicios/parametros.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-verdatosfisicos',
  templateUrl: './verdatosfisicos.component.html',
  styleUrls: ['./verdatosfisicos.component.scss']
})
export class VerdatosfisicosComponent implements OnInit {

  latestData: any = null;
  isLoading: boolean = true;

  mensajeError: string | null = null; // Mensaje de error
  imc: number | null = null; // Almacena el valor del IMC
  descripcionIMC: string = ''; // Descripción del IMC
  pesoIdealMin: number | null = null; // Peso ideal mínimo
  pesoIdealMax: number | null = null; // Peso ideal máximo

  usuarioActual: any | null = null;
  datosFisicos: any = {}; // Almacena peso y estatura
  idUsuario: number | null = null;
  constructor(private serP: PacienteService,private usuariosService: UsuariosService,public router: Router,private parametrosService: ParametrosService) {}

  ngOnInit() {
    this.cargarDatosFisicos();
    this.cargarUsuarioActual();
  }
  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      this.idUsuario = this.usuarioActual.id_usuario;
      this.cargarDatosFisicos(); // Solo llamar a cargarDatosFisicos si el id_usuario está presente
    }
  }


  cargarDatosFisicos() {
    if (this.idUsuario) {
      this.serP.obtenerDatosFisicos(this.idUsuario).subscribe(
        (respuesta) => {
         // console.log(respuesta); // Verifica que los datos se reciban correctamente
          if (respuesta.datos && respuesta.datos.length > 0) {
            // Asignamos los datos a la propiedad 'datosFisicos'
            this.datosFisicos = respuesta.datos[0];
  
            // Convertir los valores de peso y estatura a número (float)
            this.datosFisicos.peso = parseFloat(this.datosFisicos.peso);
            this.datosFisicos.estatura = parseFloat(this.datosFisicos.estatura);
            if (this.datosFisicos.peso && this.datosFisicos.estatura) {
              this.calcularIMC(this.datosFisicos.peso, this.datosFisicos.estatura);
            } else {
              this.mensajeError = 'Datos de peso o estatura no encontrados';
            }
            

            //console.log(this.datosFisicos); // Verifica que los datos se asignen correctamente
            this.isLoading = false; // Cambiar el estado de carga a falso
          } else {
            this.mensajeError = 'No se encontraron datos físicos';
            this.isLoading = false;
          }
        },
        (error) => {
          this.mensajeError = 'Error al obtener los datos físicos';
          this.isLoading = false;
        }
      );
    } else {
      this.mensajeError = 'ID de usuario no encontrado';
      this.isLoading = false;
    }
  }
  
  

  //calculo peso
  calcularIMC(peso: number, estatura: number) {
    // Convertir estatura a metros si está en centímetros
    
    this.imc = peso / (estatura * estatura);
    //console.log(peso);  // Verificar el cálculo

  
    // Calcular el peso ideal basado en un rango de IMC de 18.5 a 24.9
    this.pesoIdealMin = 18.5 * (estatura * estatura);
    this.pesoIdealMax = 24.9 * (estatura * estatura);
    console.log(this.pesoIdealMin); 
    // Determinar la descripción del IMC
    if (this.imc < 18.5) {
      this.descripcionIMC = 'Peso bajo';
    } else if (this.imc >= 18.5 && this.imc < 25) {
      this.descripcionIMC = 'Peso normal';
    } else if (this.imc >= 25 && this.imc < 30) {
      this.descripcionIMC = 'Sobrepeso';
    } else if (this.imc >= 30 && this.imc < 40) {
      this.descripcionIMC = 'Obesidad';
    } else {
      this.descripcionIMC = 'Obesidad mórbida';
    }
  }

  editardatosfisicos(){
    this.router.navigate(['/datos-fisicos']);
  }

}
