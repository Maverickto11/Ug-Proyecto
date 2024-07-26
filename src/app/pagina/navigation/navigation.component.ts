import { Component, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { BuscadorPeliculasService } from '../../Services/api.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { BuscadorPeliculasComponent } from '../buscador-peliculas/buscador-peliculas.component';

@Component({
    selector: 'app-navigation',
    standalone: true,
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.css',
    imports: [RouterModule, FormsModule, CommonModule, BuscadorPeliculasComponent]
})
export class NavigationComponent {
  id: number = 0;
  tipo: string = '';
  nombrePelicula: string = '';
  peliculasAutocompletado$: Observable<{ title: string, imageUrl: string, id: number, tipo: string }[]>;
  searchTerms = new Subject<string>();
  isOpen: boolean = false;
  ngUnsubscribe = new Subject<void>();
  peliculaSeleccionada: { title: string, imageUrl: string, id: number, tipo: string } = { title: '', imageUrl: '', id: 0, tipo: ''};

  constructor(private api: BuscadorPeliculasService, private router: Router, private elementRef: ElementRef) {
    this.peliculasAutocompletado$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) =>
        this.api.buscarSugerencias(term).pipe(
          takeUntil(this.ngUnsubscribe)
        )
      )
    );
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();  
  }

  buscarPeliculas(): void {
    if (this.nombrePelicula.trim() !== '') {
      let ruta: string;
      if (this.tipo === 'tv') {
        ruta = `/detalle/${this.tipo}/${this.id}`;
      } else {
        ruta = `/detalle/${this.tipo}/${this.id}`;
      }

      this.router.navigate([ruta], { queryParams: { nombre: this.nombrePelicula } });
      this.isOpen = false;
    }
  }

  buscarAutocompletado(): void {
    this.searchTerms.next(this.nombrePelicula);
    this.isOpen = true;
    console.log(this.nombrePelicula);
  }

  seleccionarPelicula(pelicula: { title: string, imageUrl: string, id: number, tipo: string }): void {
    this.nombrePelicula = pelicula.title;
    this.id = pelicula.id;
    this.tipo = pelicula.tipo;
    const rutaDetalles = `/detalles/${pelicula.id}`;
    this.router.navigate([rutaDetalles], { queryParams: { tipo: pelicula.tipo } });
    this.buscarPeliculas();
    this.isOpen = false;
  }
  

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event): void {
      if (this.elementRef.nativeElement.contains(event.target)) {
        this.isOpen = false;
      console.log(this.elementRef.nativeElement);
    }
  }
  
}
