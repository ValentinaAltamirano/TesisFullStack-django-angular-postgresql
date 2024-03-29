import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { AlojamientoService } from '../service/alojamiento.service';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; 

@Component({
  selector: 'app-editar-alojamiento',
  templateUrl: './editar-alojamiento.component.html',
  styleUrls: ['./editar-alojamiento.component.css']
})
export class EditarAlojamientoComponent {
  alojamientoForm: FormGroup = new FormGroup({});
  tiposAlojamiento: any[] = [];
  tiposCategoria: any[] = [];
  tiposServicio: any[] = [];
  tiposmetodosPago: any[] = [];
  imagenes: File[] = [];
  imagenesOriginales: any[] = [];
  imagenesEliminadas: any[] = [];
  vistasPrevias: string[] = [];
  idEmpresario: any;
  establecimientoId: number;
  alojamiento: any;
  imagenesAlojamiento: any[] = [];
  baseUrl = 'http://127.0.0.1:8000';
  descripcion: string = '';
  nuevasImagenes: any[] = [];
  arrayServicios:any[] = [];
  arrayMetodosPago:any[] = [];
  editando = false;
  datosOriginales: any;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private alojamientoService: AlojamientoService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {this.establecimientoId = 0;
  }
  
  ngOnInit() {
    this.obtenerTiposAlojamiento();
    this.obtenerCategoria();
    this.obtenerServicio();
    this.obtenerMetodosPago();
    this.obtenerIdEmpresario();
    
    this.initForm();
    this.route.params.subscribe(params => {
      this.establecimientoId = params['id'];
     
      this.cargarDatos()
      this.cargarImagenes();
    });
    
  }

  initForm(): void {
    this.alojamientoForm = this.fb.group({
      // Campos del establecimiento
      altura: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(50)]],
      calle: ['', [Validators.required, Validators.maxLength(50)]],
      codCategoria: ['', [Validators.required]],
      codCiudad: [1],
      codProvincia: [1],
      codEstablecimiento: [''],
      codTipoAlojamiento: [null, [Validators.required]],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
      idEmpresario: [''],
      metodos_de_pago: this.fb.array([], [Validators.required]),
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9'.,_\-&()!@#$%^*+=<>?/\|[\]{}:;`~" \p{L}]+$/u), Validators.maxLength(50)]],
      servicios: this.fb.array([], [Validators.required]),
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9\s\-\+]+$/), Validators.minLength(10), Validators.maxLength(20)]],
      imagenesEliminadas: this.fb.array([]),
      web: ['', [Validators.pattern(/^(ftp|http|https):\/\/[^ "]+$/)]],
    });
  }

  obtenerTiposAlojamiento(): void {
    this.alojamientoService.obtenerTiposAlojamiento().subscribe(
      (data) => {
        this.tiposAlojamiento = data;
      },
      (error) => {
        console.error('Error al obtener tipos de alojamiento', error);
        // Manejo de errores
      }
    );
  }

  obtenerCategoria(): void {
    this.alojamientoService.obtenerCategoria().subscribe(
      (data) => {
        this.tiposCategoria = data;
      },
      (error) => {
        console.error('Error al obtener tipos de categoria', error);
        // Manejo de errores
      }
    );
  }

  obtenerServicio(): void {
    this.alojamientoService.obtenerServicios().subscribe(
      (data: any[]) => {  // Asegúrate de especificar el tipo de datos
        this.tiposServicio = data;
      },
      (error) => {
        console.error('Error al obtener tipos de servicio', error);
        // Manejo de errores
      }
    );
  }

  obtenerMetodosPago(): void {
    this.alojamientoService.obtenerMetodosDePago().subscribe(
      (data) => {
        this.tiposmetodosPago = data;
      },
      (error) => {
        console.error('Error al obtener tipos de metodos de pago', error);
        // Manejo de errores
      }
    );
  }

  obtenerIdEmpresario() {
    this.authService.obtenerDatosEmpresario().subscribe(
      (userInfo: any) => {
        // Asignar los datos del usuario a los FormControls
        this.idEmpresario = userInfo.id;
  
        // Puedes agregar idEmpresario directamente en la inicialización del formulario
        this.alojamientoForm.get('idEmpresario')?.setValue(this.idEmpresario);
      },
      error => {
        console.error('Error al obtener la información del usuario:', error);
      }
    );
  }

  cargarDatos() {
    this.alojamientoService.obtenerAlojamiento(this.establecimientoId).subscribe(
      (alojamientoInfo: any) => {
        this.alojamientoForm.patchValue(alojamientoInfo);
        this.alojamiento = alojamientoInfo;
        
        // Cargar métodos de pago
        this.cargarMetodosDePago(alojamientoInfo.metodos_de_pago);
        this.arrayMetodosPago = alojamientoInfo.metodos_de_pago;
  
        // Cargar servicios
        this.cargarServicios(alojamientoInfo.servicios);
        this.arrayServicios = alojamientoInfo.servicios;

        const metodosPagoFormArray = this.alojamientoForm.get('metodos_de_pago') as FormArray;
          this.tiposmetodosPago.forEach((nombre: string) => {
              const metrodoDePagoSeleccionado = alojamientoInfo.metodos_de_pago.find((s: any) => s.nombre === nombre);
              const isSelected = !!metrodoDePagoSeleccionado;
              metodosPagoFormArray.push(this.fb.control(isSelected));
          });

          const serviciosFormArray = this.alojamientoForm.get('servicios') as FormArray;
          this.tiposServicio.forEach((nombre: string) => {
              const tipoComercioSeleccionado = alojamientoInfo.servicios.find((s: any) => s.nombre === nombre);
              const isSelected = !!tipoComercioSeleccionado; // true si se encuentra, false si no se encuentra
              serviciosFormArray.push(this.fb.control(isSelected));
          });
  
        this.datosOriginales = { ...alojamientoInfo };
      },
      error => {
        console.error('Error al obtener la información del alojamiento', error);
      }
    );
  }

  cargarServicios(serviciosSeleccionados: any[]): void {
    const serviciosFormArray = this.alojamientoForm.get('servicios') as FormArray;
    serviciosFormArray.clear();  // Limpiar el FormArray antes de agregar nuevos valores
  
    this.tiposServicio.forEach((servicio: { codTipoServicio: number }) => {
      const isSelected = serviciosSeleccionados.includes(servicio.codTipoServicio);
      serviciosFormArray.push(this.fb.control(isSelected));
    });
  }

  cargarMetodosDePago(metodos_de_pago: any[]): void {
    const metodosDePagoArray = this.alojamientoForm.get('metodos_de_pago') as FormArray;
    metodosDePagoArray.clear();  // Limpiar el FormArray antes de agregar nuevos valores
  
    metodos_de_pago.forEach(metodo => {
      metodosDePagoArray.push(this.fb.control(metodo));
    });
  }

  cargarImagenes() {
    this.alojamientoService.obtenerImagenesAlojamiento(this.establecimientoId).subscribe(
      (data) => {
        this.imagenesAlojamiento = data;
        this.imagenesOriginales = [...data]; // Almacena las imágenes originales
      },
      (error) => {
        console.error('Error al obtener imágenes:', error);
      }
    );
  }
  
  toggleCheckbox(index: number, item: any, formControlName: string): void {
    const formArray = this.alojamientoForm.get(formControlName) as FormArray;
  
    if (!formArray) {
      console.error(`FormArray ${formControlName} not found in the form.`);
      return;
    }
  
    // Buscar el ítem específico en el FormArray
    const control = formArray.controls[index] as FormControl;
  
    if (control) {
      const isChecked = control.value;
      console.log('isChecked', isChecked);
  
      // Cambiar el valor del control usando el valor del ítem
      control.setValue(!isChecked);
      console.log('index', index);
      console.log('formControlName', formControlName);
      console.log('item', item);
    } else {
      console.error(`Control at index ${index} in FormArray ${formControlName} is not a FormControl.`);
    }
  }
  
  // Assuming you have a method to get the control for a specific index
  getFormControl(formControlName: string, index: number): AbstractControl | null {
    const formArray = this.alojamientoForm.get(formControlName) as FormArray;
  
    if (formArray && formArray.length > index) {
      return formArray.at(index);
    }
  
    return null;
  }

  isMetodoDePagoSeleccionado(metodoPago: any): boolean {
    return this.arrayMetodosPago.some((s: any) => s.nombre == metodoPago);
  }

  isServicioSeleccionado(servicio: any): boolean {
    return this.arrayServicios.some((s: any) => s.nombre == servicio);
  }

  toggleEdicion() {
    this.editando = !this.editando;
  }

  eliminarImagen(index: number) {
  // Obtén el codImagen de la imagen que estás eliminando
  const codImagen = this.imagenesAlojamiento[index].codImagen;

  // Agrega el codImagen al FormArray 'imagenesEliminadas'
  const imagenesEliminadasArray = this.alojamientoForm.get('imagenesEliminadas') as FormArray;
  imagenesEliminadasArray.push(this.fb.control(codImagen));

  // Elimina la imagen del array 'imagenesAlojamiento'
  this.imagenesAlojamiento.splice(index, 1);
}

  agregarImagen(event: any) {
    const fileList: FileList = event.target.files;
  
    if (fileList.length > 0) {
      const nuevaImagen = {
        imagen: fileList[0],
        // Otras propiedades relacionadas con la imagen si es necesario
      };
  
      this.nuevasImagenes.push(nuevaImagen);
    }
  }

  getUrlFromImageObject(imagen: any): SafeUrl {
    if (imagen && imagen.imagen) {
      // Sanitize the URL to avoid the ExpressionChangedAfterItHasBeenCheckedError
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imagen.imagen));
    }
    // If no image, you can provide a default safe URL or handle it based on your needs
    return 'https://ruta.de.la.imagen.por.defecto/';
  }

  eliminarNuevaImagen(index: number): void {
    this.nuevasImagenes.splice(index, 1);
  }

  cancelarEdicion() {
    this.editando = false;
    // Restaurar los datos editados a los originales
    this.alojamientoForm.patchValue(this.datosOriginales);
  }

  volverMisEstablecimiento() {
    this.router.navigate(['/misEstablecimiento']).then(() => {
      location.reload();
    }); 
  }

  convertirSaltosDeLinea(texto: string): string {
    return texto.replace(/\n/g, '<br>');
  }

  prevenirAperturaDesplegable(event: Event): void {
    if (!this.editando) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  convertirSaltosDeLineaEnBr(texto: string): string {
    return texto.replace(/\n/g, '<br>');
  }

  guardarAlojamiento(): void {
    
    const descripcionConvertida = this.convertirSaltosDeLineaEnBr(this.alojamientoForm.get('descripcion')?.value);
    this.alojamientoForm.get('descripcion')?.setValue(descripcionConvertida);

    console.log(this.alojamientoForm.value.servicios)

    if (this.alojamientoForm.value) {
      // Obtener servicios seleccionados
      const serviciosSeleccionados = this.alojamientoForm.value.servicios
      .map((valor: boolean, index: number) => valor ? this.tiposServicio[index] : null)
        .filter((valor: any) => valor !== null);

      // Obtener métodos de pago seleccionados
      const metodosDePagoSeleccionados = this.alojamientoForm.value.metodos_de_pago
        .map((valor: boolean, index: number) => valor ? this.tiposmetodosPago[index] : null)
        .filter((valor: any) => valor !== null);

      // Crear el objeto datosEnviar con los valores mapeados
      const datosEnviar = {
        ...this.alojamientoForm.value,
        servicios: serviciosSeleccionados,
        metodos_de_pago: metodosDePagoSeleccionados
      }; 

      if (this.alojamientoForm.valid) {
          this.alojamientoService.actualizarDatos(datosEnviar).subscribe(
            (response: any) => { 
              this.actualizarImagenes(this.establecimientoId);
            },
            (error) => {
              // Manejar el error, mostrar mensajes de error apropiados al usuario
              console.error(error);
            }
          );
        }
      }
  }

  actualizarImagenes(alojamientoId: number) {
    // Accede a las imágenes directamente desde el FormGroup
    const formData = new FormData();
  
    // Agregar imágenes existentes al FormData
    this.imagenesOriginales.forEach(imagen => {
      formData.append('imagenes', imagen.imagen);
    });
  
    // Agregar nuevas imágenes al FormData
    const nuevasImagenes = this.nuevasImagenes.map(imagen => imagen.imagen);
    for (const nuevaImagen of nuevasImagenes) {
      formData.append('imagenes', nuevaImagen);
    }

    // Agregar imágenes eliminadas al FormData
    const imagenesEliminadasArray = this.alojamientoForm.get('imagenesEliminadas') as FormArray;

    imagenesEliminadasArray.getRawValue().forEach((codImagen: any) => {
      formData.append('imagenesEliminadas', codImagen);
    });

    this.alojamientoService.actualizarImagenes(formData, alojamientoId).subscribe(
      (response: any) => {
        Swal.fire({
          title: "Datos actualizados correctamente!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1000, 
          timerProgressBar: true
        }).then(() => {
          location.reload();
        });
      },
      (error) => {
        // Manejar el error, mostrar mensajes de error apropiados al usuario
        console.error(error);
      }
    );
  }
  eliminarImagenesEliminadas(alojamientoId: number): void {
    const idsImagenesAEliminar: number[] = this.imagenesAlojamiento
      .filter(actual => !this.imagenesOriginales.some(original => original.id === actual.id))
      .map(imagen => imagen.id);
    
  }

}
