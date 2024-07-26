import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomePeliculaComponent } from './pagina/homes/home-pelicula/home-pelicula.component';
import { NavigationComponent } from "./pagina/navigation/navigation.component";
import { SeriesComponent } from "./pagina/homes/series/series.component";
import { InicioComponent } from './pagina/homes/inicio/inicio.component';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "./pagina/footer/footer.component";

@Component({
    selector: 'app-root',
    standalone: true, // Remove incorrect imports
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, NavigationComponent, HomePeliculaComponent, SeriesComponent, InicioComponent, FooterComponent]
})
export class AppComponent {
  title = 'TrailersApp';
}
