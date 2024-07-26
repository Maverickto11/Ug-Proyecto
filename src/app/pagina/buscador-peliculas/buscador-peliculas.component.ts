import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BuscadorPeliculasService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationComponent } from '../navigation/navigation.component';
import { TrailersComponent } from '../trailers/trailers.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-buscador-peliculas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buscador-peliculas.component.html',
  styleUrl: './buscador-peliculas.component.css'
})

export class BuscadorPeliculasComponent implements OnInit{
  
  tipo: any;
  resultados: any[] = [];
  private routeSub: Subscription = new Subscription();
  detallesPelicula: any; // Objeto para almacenar los detalles de la película
  idPelicula: any;
  mostrarAviso: boolean = true;
  detalle: any;

  constructor(private api: BuscadorPeliculasService, private route: ActivatedRoute, private nave: NavigationComponent, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtenerPeliculaSerie();
  }
  
  obtenerPeliculaSerie() {
    this.route.params.subscribe(params => {
      this.idPelicula = params['id'];
      this.tipo = params['tipo'];
      // Determinar el tipo de contenido y realizar acciones según sea necesario
      if (this.tipo === 'movie') {
        // Lógica específica para películas
        this.obtenerDetallePelicula();
      } else if (this.tipo === 'tv') {
        // Lógica específica para series
        this.obtenerDetalleSerie(); 
      }
    });
    this.route.queryParams.subscribe(params => {
      this.detallesPelicula = params['nombre'];
    });
  }

  obtenerDetallePelicula() {
    this.api.getDetallesPelicula(this.idPelicula).subscribe(
      (data: any) => {
        this.detallesPelicula = data;
        // Aquí puedes asignar los detalles de la película a una variable para mostrar en la plantilla HTML
      },
      error => {
        console.error('Error al obtener los detalles de la película:', error);
      }
    );
  }

  obtenerDetalleSerie() {
    this.api.getDetallesSerie(this.idPelicula).subscribe(
      (data: any) => {
        this.detallesPelicula = data;
        // Aquí puedes asignar los detalles de la película a una variable para mostrar en la plantilla HTML
      },
      error => {
        console.error('Error al obtener los detalles de la película:', error);
      }
    );
  }

  portadaPelicula(): string {
    return `https://image.tmdb.org/t/p/original${this.detallesPelicula.poster_path}`;
  }

  fondoPelicula(): string {
    return `https://image.tmdb.org/t/p/original${this.detallesPelicula.backdrop_path}`;
  }
  
  openModal(): void {
    this.mostrarAviso = false;
    const dialogRef = this.dialog.open(TrailersComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data: { id: this.detallesPelicula.id, tipo: this.tipo } // Pasa la ID y el tipo al abrir el modal
    });
  }
  
  }
