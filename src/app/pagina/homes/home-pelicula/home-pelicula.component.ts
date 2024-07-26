import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscadorPeliculasService } from '../../../Services/api.service';
import { Params, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { PaginationComponent } from "../../pagination/pagination.component";
import { TrailersComponent } from '../../trailers/trailers.component';

@Component({
    selector: 'app-home-pelicula',
    standalone: true,
    templateUrl: './home-pelicula.component.html',
    styleUrl: './home-pelicula.component.css',
    imports: [CommonModule, PaginationComponent, TrailersComponent]
})
export class HomePeliculaComponent implements OnInit {

  movies: any[] = [];
  itemsPerRow: number = 4; // Define el número de columnas
  totalPages: number = 1;
  currentPage: number = 1;

  selectedMovieId: number = 0;
  constructor(private api: BuscadorPeliculasService, private router: Router) { }

  ngOnInit(): void {
    this.getMovies(this.currentPage);
  }

  getMovies(pageNumber: number): void {
    this.api.getMovies(pageNumber).subscribe(
      (result: { results: any[], total_pages: number }) => {
        this.movies = result.results;
        this.totalPages = result.total_pages;
        this.currentPage = pageNumber;
        this.preloadImages(); // Precargar las imágenes después de obtenerlas de la API
      },
      error => {
        console.error('Error fetching movies:', error);
      }
    );
  }

  preloadImages(): void {
    const adjacentPages = [this.currentPage - 1, this.currentPage, this.currentPage + 1];
    adjacentPages.forEach(page => {
      if (page >= 1 && page <= this.totalPages) {
        this.api.getMovies(page).subscribe(response => {
          // Lógica para manejar la respuesta y cargar las imágenes
          response.results.forEach((movie: any) => { // Asegúrate de acceder a 'results' en lugar de 'movies'
            const imageUrl = this.getMovieImageUrl(movie);
            const image = new Image();
            image.src = imageUrl;
            // Aquí puedes hacer algo con la URL de la imagen, como pre-cargarla o almacenarla en una lista
          });
        });
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getMovies(this.currentPage); // Pasar currentPage como argumento
    }
  }

  getMovieImageUrl(movie: any): string {
    // Lógica para construir la URL de la imagen a partir de movie.backdrop_path o movie.poster_path
    return `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
  }

  chunk(array: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, index * size + size)
    );
  }

  trailer(id: number) {
    this.router.navigate(['trailersPeliculas', id]);
  }

  detalles(id: number) {
    this.router.navigate(['detallesPeliculas', id]);
  }

}