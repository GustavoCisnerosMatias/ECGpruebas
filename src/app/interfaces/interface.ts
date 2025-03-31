export interface IMenu {
  men_descripcion: string;
  men_icono: string;
  men_pagina: string;
  categoria: number;
}
export interface ITopic {
  nombre: string;
}

export interface Dato {
  id_parametro: number;
  codigo: number;
  valor: number;
  
}
export interface Datosfisicos {
  estatura: string;
  peso: string;
}

export interface AuthResponse {
  mensaje: string;
  id_rol: number;
  id_usuario: number;
  nombre: string;
  foto: string; 
  peso: Datosfisicos[]; // Agregar el array de objetos de peso
  menu: IMenu[];
}

  export interface alertas{
    fecha_alerta:string;
    vista:string;
    nombre_alerta:string;
    descripcion:string;
    valor:number;
    a_nombre:string;
    unidad_medida:string;
    id_alertas:number;
  }
  export interface alertasme{
    hora_alerta:string;
    nombre_alerta:string;
    nombre:string;
    apellido:string;
    valor:number;
    cedula:string;
    unidad_medida:string;
    vista: string;
    nombre_parametro:string;
  }
  
 

  


  export interface Parametro {
    id_parametro: number;
    nombre: string;
    estado: string;
    unidad_medida: string;
    icono:string;
  }
  
  export interface RespuestaParametros {
    mensaje: string;
    total: number;
    datos: Parametro[];
  }
  export interface Receta {
    fecha_receta: string;
    fecha_vencimiento: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    instrucciones: string;
    observaciones: string | null; // Puede ser null
    codigo: string;
    denominacion_comun_internacional: string;
    forma_farmaceutica: string;
    motivo_consulta: string;
    id_medic:string;
    concentracion:string;
    nombre:string;
    apellido:string;
    cedula:string;
    Genero:string;
    fecha_nacimiento:string;
  }
  

  export interface DatoBiome {
    fecha: string;
    nombre: string;
    unidad_medida: string;
    valor: string;
  }
  export interface Respuestadata {
    success: boolean; // Indica si la operación fue exitosa
    message: string;  // Mensaje de respuesta de la API
    data?: Parametro; // Datos del nuevo parámetro si aplica
  }
 
  export interface RespuestaData {
    mensaje: string;
    datos: DatoBiome[]; 
  }

  export interface pacientes {
    fecha_nacimiento: string;
    id_usuario: number;
    nombre: string;
    apellido: string;
    telefono: string;
    correo_electronico: string;
    cedula: string;
    foto_base64: string;
}
export interface DatosFisicos {
  id_datos_fisicos: number;
  id_usuario: number;
  peso: string;
  estatura: string;
  nivel_condicion_fisica: string;
}

export interface DatosFisicosResponse {
  datosfisicos: DatosFisicos[];
}

export interface tipoalerta {
  id_tipoalerta: number;        
  nombre_alerta: string;        
  descripcion: string;          
  estado: string;               
  rango_min: string;             
  rango_max: string;            
  edad_min: number;              
  edad_max: number;             
  genero: string | null;        
  fecha: string;                 
  id_parametro: number;          
}
