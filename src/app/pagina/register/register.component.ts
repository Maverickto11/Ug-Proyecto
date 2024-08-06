import { Component } from '@angular/core';
import { BuscadorPeliculasService } from '../../Services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private api: BuscadorPeliculasService, private router: Router) { }
  
  register() {
    this.api.register({ nombre: this.nombre, email: this.email, password: this.password }).subscribe(
      response => {
        if (response.exito) {
          this.nombre = '';
          this.email = '';
          this.password = '';
          this.successMessage = 'Registro exitoso!';
          this.errorMessage = '';

          // Redirigir a la página de login u otra página
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.errorMessage = response.mensaje;
          this.successMessage = '';
        }
      },
      error => {
        console.error('Error en el registro', error);
        this.errorMessage = 'Error en el servidor, inténtalo de nuevo más tarde';
        this.successMessage = '';

      }
    );
  }
}
