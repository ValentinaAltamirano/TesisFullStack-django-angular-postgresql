import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent  {
  perfilForm!: FormGroup;
  apellido = new FormControl('');
  nombre = new FormControl('');
  email = new FormControl('', [Validators.email]);
  telefono = new FormControl('');
  username = new FormControl('');
  razonSocial = new FormControl('');

  editando = false;
  datosOriginales: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Inicializar FormGroup y asignar FormControls
    this.perfilForm = this.fb.group({
      apellido: this.apellido,
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      username: this.username,
      razonSocial: this.razonSocial
    });

    // Obtener y asignar los datos del usuario
    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario() {
    this.authService.obtenerDatosEmpresario().subscribe(
      (userInfo: any) => {
        // Asignar los datos del usuario a los FormControls
        this.perfilForm.patchValue(userInfo);

        // Almacenar los datos originales para restaurar en caso de cancelación
        this.datosOriginales = { ...userInfo };
      },
      error => {
        console.error('Error al obtener la información del usuario:', error);
      }
    );
  }

  toggleEdicion() {
    this.editando = !this.editando;
  }

  guardarCambios() {
    const nuevosDatos = this.perfilForm.value;

    this.authService.actualizarDatosEmpresario(nuevosDatos).subscribe(
      response => {
        console.log('Datos actualizados exitosamente', response);
        this.editando = false;

        // Actualizar datos originales con los nuevos valores
        this.datosOriginales = { ...nuevosDatos };
      },
      error => {
        console.error('Error al actualizar los datos del empresario', error);
      }
    );
  }

  cancelarEdicion() {
    this.editando = false;
    // Restaurar los datos editados a los originales
    this.perfilForm.patchValue(this.datosOriginales);
  }

  volverAlInicio() {
    this.router.navigate(['/']).then(() => {
      location.reload();
    }); 
  }
}