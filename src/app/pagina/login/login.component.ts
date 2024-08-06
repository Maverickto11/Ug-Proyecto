import { Component } from '@angular/core';
import { BuscadorPeliculasService } from '../../Services/api.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';  

  constructor(private api: BuscadorPeliculasService, private router: Router) { }

  login() {
    this.api.login({ email: this.email, password: this.password }).subscribe(
      response => {
        if (response.exito) {
          // Redirigir a la página de inicio u otra página
          this.router.navigate(['/inicio']);
        } else {
          this.errorMessage = response.mensaje;
        }
      },
      error => {
        console.error('Error en el login:', error);
        this.errorMessage = 'Error en el servidor, inténtalo de nuevo más tarde';
      }
    );
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
