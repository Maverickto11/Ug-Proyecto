import { Component, OnInit } from '@angular/core';
import { BuscadorPeliculasService } from '../../../Services/api.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from "../../pagination/pagination.component";
import { Router } from '@angular/router';

@Component({
    selector: 'app-series',
    standalone: true,
    templateUrl: './series.component.html',
    styleUrl: './series.component.css',
    imports: [CommonModule, PaginationComponent]
})
export class SeriesComponent implements OnInit{
  
  totalPages: number = 1;
  series: any[] = [];
  currentPage: number = 1;
  itemsPerRow: number = 4; // Define el número de columnas

  constructor(private api: BuscadorPeliculasService, private router: Router) { }
  
  ngOnInit(): void {
    this.getSeries(this.currentPage);
  }

  getSeries(pageNumber: number): void {
    this.api.getSeries(pageNumber)
      .subscribe(
        (result: { results: any[], total_pages: number }) => { // Update the type of 'result' parameter
          this.series = result.results;
          this.totalPages = result.total_pages;
          this.currentPage = pageNumber;
          this.preloadImages();
          console.log(this.series,'series');
        },
        error => {
          console.error('Error fetching movies:', error);
        }
      );
  }
  chunk(array: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, index * size + size)
    );
  }
  preloadImages(): void {
    const adjacentPages = [this.currentPage - 1, this.currentPage, this.currentPage + 1];
    adjacentPages.forEach(page => {
      if (page >= 1 && page <= this.totalPages) {
        this.api.getSeries(page).subscribe(response => {
          // Lógica para manejar la respuesta y cargar las imágenes
          response.results.forEach((series: any) => { // Asegúrate de acceder a 'results' en lugar de 'movies'
            const imageUrl = this.getSeriesImageUrl(series);
            const image = new Image();
            image.src = imageUrl;
          });
        });
      }
    });
  }
  getSeriesImageUrl(series: any): string {
    // Lógica para construir la URL de la imagen a partir de movie.backdrop_path o movie.poster_path
    return `https://image.tmdb.org/t/p/original/${series.poster_path}`;
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getSeries(this.currentPage); // Pasar currentPage como argumento
    }
  }

  trailerSeries(id: number) {
    this.router.navigate(['trailersSeries', id]);
  }

  detallesSeries(id: number) {
    this.router.navigate(['detallesSeries', id]);
  }

}
