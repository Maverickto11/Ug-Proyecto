import { Component } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { HomePeliculaComponent } from './pagina/homes/home-pelicula/home-pelicula.component';
import { NavigationComponent } from "./pagina/navigation/navigation.component";
import { SeriesComponent } from "./pagina/homes/series/series.component";
import { InicioComponent } from './pagina/homes/inicio/inicio.component';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "./pagina/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true, // Remove incorrect imports
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, NavigationComponent, HomePeliculaComponent, SeriesComponent, InicioComponent, FooterComponent]
})
export class AppComponent {
  title = 'TrailersApp';

  navbarClass = '';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.navbarClass = event.urlAfterRedirects === '/login' || event.urlAfterRedirects === '/register' 
          ? 'hide-navbar' 
          : '';
      }
    });
  }
}
