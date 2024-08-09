import { RouterModule, Routes } from '@angular/router';
import { TrailersComponent } from './pagina/trailers/trailers.component';
import { DetallesComponent } from './pagina/detalles/detalles.component';
import { DetalleMovieComponent } from './pagina/detalles/detalle-movie/detalle-movie.component';
import { BuscadorPeliculasComponent } from './pagina/buscador-peliculas/buscador-peliculas.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'inicio', loadComponent: () => import('./pagina/homes/inicio/inicio.component')
    .then(m => m.InicioComponent)},
    {path: 'peliculas', loadComponent: () => import('./pagina/homes/home-pelicula/home-pelicula.component')
    .then(m => m.HomePeliculaComponent)},
    {path: 'series', loadComponent: () => import('./pagina/homes/series/series.component')
    .then(m => m.SeriesComponent)},
    {path: 'registroPeliculas', loadComponent: () => import('./pagina/homes/registrar-pelicula/registrar-pelicula.component')
        .then(m => m.RegistrarPeliculaComponent)},
    {path: 'login', loadComponent: () => import('./pagina/login/login.component')
        .then(m => m.LoginComponent)},
    {path: 'register', loadComponent: () => import('./pagina/register/register.component')
        .then(m => m.RegisterComponent)},
    {path: 'registroSeries', loadComponent: () => import('./pagina/homes/series/registrar-series/registrar-series.component')
        .then(m => m.RegistrarSeriesComponent)},
    { path: 'trailersPeliculas/:id', component: TrailersComponent, data: { tipo: 'movie' } },
    { path: 'trailersSeries/:id', component: TrailersComponent, data: { tipo: 'serie' } },
    { path: 'detallesPeliculas/:id', component: DetalleMovieComponent, data: { tipo: 'movie' } },
    { path: 'detallesSeries/:id', component: DetallesComponent, data: { tipo: 'serie' } },
    { path: 'buscador', loadComponent: () => import('./pagina/buscador-peliculas/buscador-peliculas.component')
    .then(m => m.BuscadorPeliculasComponent)},
    { path: 'detalle/:tipo/:id', component: BuscadorPeliculasComponent }, // Ruta para detalles de películas y series

];
