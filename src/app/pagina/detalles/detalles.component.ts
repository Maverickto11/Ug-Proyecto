import { Component, OnInit } from '@angular/core';
import { BuscadorPeliculasService } from '../../Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TrailersComponent } from '../trailers/trailers.component';
import { SerieData } from '../../environment/SerieData';
import { PeliculaData } from '../../environment/PeliculaData';
import { Comentario } from '../../Models/Comentario';
@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.css'
})
export class DetallesComponent implements OnInit {
  isFavorite: boolean = false;
  userId: number = 1;

  mostrarAviso: boolean = true;
  detalleGenero: any;
  currentDialogRef: MatDialogRef<any> | undefined;
  detalle: any;
  detallesPeli: string = '';
  seriesId: number | undefined;
  listaCommnet: Comentario[] = [];
  nuevoComentarioTexto: string = '';
  modoEdicion: { [key: string]: boolean } = {};
  comentarioEditado: Comentario | null = null;
  constructor(private api: BuscadorPeliculasService, private router: ActivatedRoute, public dialog: MatDialog, private route: Router) { }

  ngOnInit(): void {
    this.Detalles();
    this.checkIfFavorite();
    this.obtenerComentarios();

  }

  /*private Detalles(): void {
    this.router.params.subscribe(params => {
      const id = +params['id']; // Convertir el ID a número
      const tipo = this.router.snapshot.data['tipo']; // Obtener el tipo de contenido de los datos de la ruta
      if(id && tipo){
        const apiDetalles = (tipo === 'movie') ? this.api.getDetallesPelicula(id) : this.api.getDetallesSerie(id);
        apiDetalles.subscribe(
          (result: any[]) => {
            this.detalle = result;
           console.log(this.detalle);
          });
      }
    });
  }*/
  /*private Detalles(): void {
    this.router.params.subscribe(params => {
      const id = +params['id']; // Convertir el ID a número
      if (id) {
        this.api.getDetallesSerie1(id).subscribe(
          (result: SerieData) => {
            this.detalle = result;
            console.log('Detalles de la serie:', this.detalle);
          },
          error => {
            console.error('Error al obtener los detalles de la serie', error);
          }
        );
      }
    });
  }*/
  
    obtenerComentarios(): void {
      this.api.getComentarios().subscribe({
        next: data => {
          this.listaCommnet = data
        },
        error: error => {
          alert("Ocurrió un error");
        }
      })
  }
  
  publicarComentario(): void {
    const nuevoComentario: Comentario = {
      id: String(this.listaCommnet.length + 1),
      user: "Christian",
      comment: this.nuevoComentarioTexto,
      isAuth: true
    };

    this.api.agregarComentario(nuevoComentario).subscribe({
      next: comentario => {
        this.listaCommnet.push(comentario);
        this.nuevoComentarioTexto = '';
      },
      error: error => {
        alert('Ocurrio un error: ' + error);
      }
    });
  }

  editarComentario(): void {
    if (this.comentarioEditado) {
      this.api.actualizarComentario(this.comentarioEditado).subscribe({
        next: (comentarioActualizado) => {
          const index = this.listaCommnet.findIndex(com => com.id === comentarioActualizado.id);
          if (index !== -1) {
            this.listaCommnet[index] = comentarioActualizado;
          }
          this.modoEdicion[comentarioActualizado.id] = false; // Desactivar el modo de edición
          this.comentarioEditado = null; // Limpiar la variable de comentario editado
          alert("Comentario actualizado exitosamente");
        },
        error: (error) => {
          let mensajeError = "Ocurrió un error al actualizar el comentario";
          if (error.error && error.error.message) {
            mensajeError = error.error.message;
          } else if (error.message) {
            mensajeError = error.message;
          }
          console.error("Error:", error); // Imprime el error en la consola para depuración
          alert(mensajeError);
        }
      });
    }
  }

  activarEdicion(comentario: Comentario): void {
    this.modoEdicion[comentario.id] = true;
    this.comentarioEditado = { ...comentario }; // Crea una copia del comentario para editar
  }

  borrarComentario(id: string): void {
    const idStr = String(id); // Convierte el ID a string
  
    this.api.eliminarComentario(idStr).subscribe({
      next: () => {
        // Filtra la lista para eliminar el comentario con el ID especificado
        this.listaCommnet = this.listaCommnet.filter(com => com.id !== idStr);
      },
      error: error => {
        alert("Ocurrió un error al eliminar el comentario");
      }
    });
  }
  

    private Detalles(): void {
      this.router.params.subscribe(params => {
        const id = +params['id']; // Convertir el ID a número
        if (id) {
          this.api.getDetallesSerie1(id).subscribe(
            (result: SerieData) => {
              this.detalle = result;
              console.log('Detalles de la Movie:', this.detalle);
              
              // Extraer y mostrar nombres de géneros
              if (this.detalle?.seriesGenres?.$values) {
            //    const genreNames = this.detalle.movieGenres.$values.map((sg: SerieData) => sg.genre.name);
           //     console.log('Géneros de la película:', genreNames);
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
      data: { id: this.detalle.id, tipo: this.router.snapshot.data['tipo'] } // Pasa la ID y el tipo al abrir el modal
    });
  }


  closeModal(): void {
    // Cierra el modal si existe
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
      this.currentDialogRef = undefined; // Limpia la referencia
    }
  }
  openTrailer(): void {
    if (this.detalle && this.detalle.trailer) {
      console.log('Trailer URL:', this.detalle.trailer);  // Verifica la URL en la consola
      window.open(this.detalle.trailer, '_blank');
    } else {
      console.error('No trailer URL found');
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
      this.isFavorite = favoriteItems.some((f: { movieId: any; }) => f.movieId === this.detalle.seriesId);
    });
  }

  toggleFavorite(): void {
    console.log('Current isFavorite:', this.isFavorite);
    if (this.isFavorite) {
      this.api.removeFavorite(this.userId, this.detalle.seriesId).subscribe(() => {
        this.isFavorite = false; // Cambia el estado a false cuando se elimina el favorito
        console.log('Removed from favorites');
      });
    } else {
      const favorite = {
        userId: this.userId,
        movieId: this.detalle.seriesId,
        movieTitle: this.detalle.title,
        posterPath: this.detalle.posterPath,
      };
      this.api.addFavorite(favorite).subscribe(() => {
        this.isFavorite = true; // Cambia el estado a true cuando se agrega el favorito
        console.log('Added to favorites');
      });
    }
  }
  
}
