import { Component, OnInit, TrackByFunction } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BuscadorPeliculasService } from '../../../Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculaData } from '../../../environment/PeliculaData';
import { TrailersComponent } from '../../trailers/trailers.component';
import { CommonModule } from '@angular/common';
import { MovieGenre } from '../../../environment/MovieGenre';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../environment/Usuario';
import { Comentario } from '../../../environment/Comentario';

@Component({
  selector: 'app-detalle-movie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-movie.component.html',
  styleUrl: './detalle-movie.component.css'
})
export class DetalleMovieComponent implements OnInit {
  isFavorite: boolean = false;
  userId: number = 1;

  mostrarAviso: boolean = true;
  detalleGenero: any;
  currentDialogRef: MatDialogRef<any> | undefined;
  detalle: any;
  detallesPeli: string = '';
  seriesId: number | undefined;

  comentarios: Comentario[] = [];
  nuevoComentario: string = '';


  constructor(
    private api: BuscadorPeliculasService, 
    private router: ActivatedRoute, 
    public dialog: MatDialog, 
    private route: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.Detalles();
    this.checkIfFavorite();
    this.loadComentarios();
  }



 /* private Detalles(): void {
    this.router.params.subscribe(params => {
      const id = +params['id']; // Convertir el ID a número
      if (id) {
        this.api.getDetallesMovie1(id).subscribe(
          (result: PeliculaData) => {
            this.detalle = result;
            console.log('Detalles de la Movie:', this.detalle);
            console.log('Géneros de la película:', this.detalle?.movieGenres?.$values);

          },
          error => {
            console.error('Error al obtener los detalles de la Movie', error);
          }
        );
      }
    });
  }*/
    private Detalles(): void {
      this.router.params.subscribe(params => {
        const id = +params['id']; // Convertir el ID a número
        if (id) {
          this.api.getDetallesMovie1(id).subscribe(
            (result: PeliculaData) => {
              this.detalle = result;
              console.log('Detalles de la Movie:', this.detalle);
              
              // Forzar la detección de cambios
              this.cdr.detectChanges();
              
              if (this.detalle?.movieGenres?.$values) {
                const genreNames = this.detalle.movieGenres.$values.map((mg: MovieGenre) => mg.genre.name);
                console.log('Géneros de la película:', genreNames);
              } else {
                console.log('No se encontraron géneros para esta película.');
              }
            },
            error => {
              console.error('Error al obtener los detalles de la Movie', error);
            }
          );
        }
      });
    }
    
    
    trackByGenre(index: number, genre: MovieGenre): number {
      return genre.genreId; // Usa un identificador único
    }
    
    

  portadaPelicula(): string {
    return this.detalle?.posterPath || '';  // Devuelve una cadena vacía si detalle o posterPath son undefined
  }

  fondoPelicula(): string {
    return this.detalle?.backdropPath || '';  // Devuelve una cadena vacía si detalle o backdropPath son undefined
  }

  openModal(): void {
    this.mostrarAviso = false;
    const dialogRef = this.dialog.open(TrailersComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data: { id: this.detalle.movieId, tipo: this.router.snapshot.data['tipo'] } // Pasa la ID y el tipo al abrir el modal
    });
  }
  openTrailer(): void {
    if (this.detalle && this.detalle.trailer) {
      console.log('Trailer URL:', this.detalle.trailer);  // Verifica la URL en la consola
      window.open(this.detalle.trailer, '_blank');
    } else {
      console.error('No trailer URL found');
    }
  }

  closeModal(): void {
    // Cierra el modal si existe
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
      this.currentDialogRef = undefined; // Limpia la referencia
    }
  }

  trailerSeries(id: number) {
    this.route.navigate(['trailersPeliculas', id]);
  }

  /*checkIfFavorite(): void {
    // Lógica para verificar si la película está en favoritos
    this.api.getFavorites(this.userId).subscribe(favorites => {
      this.isFavorite = favorites.some((f: { movieId: any; }) => f.movieId === this.detalle.seriesId);
    });
  }*/

  checkIfFavorite(): void {
    // Lógica para verificar si la película está en favoritos
    this.api.getFavorites(this.userId).subscribe(favorites => {
      const favoriteItems = favorites.$values || favorites; // Accede a los valores si están en $values
      this.isFavorite = favoriteItems.some((f: { movieId: any; }) => f.movieId === this.detalle.movieId);
    });
  }

  toggleFavorite(): void {
    console.log('Current isFavorite:', this.isFavorite);
    if (this.isFavorite) {
      this.api.removeFavorite(this.userId, this.detalle.movieId).subscribe(() => {
        this.isFavorite = false;  // Cambia a false cuando se remueve de favoritos
        console.log('Removed from favorites');
      });
    } else {
      const favorite = {
        userId: this.userId,
        movieId: this.detalle.movieId,
        movieTitle: this.detalle.title,
        posterPath: this.detalle.posterPath,
        backdropPath: this.detalle.backdropPath,
        overview: this.detalle.overview,
      };

      this.api.addFavorite(favorite).subscribe(() => {
        this.isFavorite = true;  // Cambia a true cuando se añade a favoritos
        console.log('Added to favorites');
      });
    }
  }
  private loadComentarios(): void {
    if (this.detalle?.movieId) {
      this.api.getComentariosPorPelicula(this.detalle.movieId).subscribe(
        (data: Comentario[]) => {
          this.comentarios = data;  // Directamente asigna el array de comentarios
        },
        error => console.error('Error al obtener los comentarios', error)
      );
    }
  }

  addComentario(): void {
    if (this.nuevoComentario && this.detalle?.movieId) {
      const comentario: Comentario = {
        id: 0,
        contenido: this.nuevoComentario,
        fecha: new Date(),
        usuarioId: this.userId,
        usuario: {} as Usuario,
        movieId: this.detalle.movieId
      };

      this.api.addComentario(comentario).subscribe(
        (data: Comentario) => {
          this.comentarios.push(data);
          this.nuevoComentario = ''; // Limpiar el campo de texto
        },
        error => console.error('Error al agregar el comentario', error)
      );
    }
  }

}
