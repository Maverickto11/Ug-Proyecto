import { Component } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PeliculaData } from '../../../environment/PeliculaData';
import { BuscadorPeliculasService } from '../../../Services/api.service';
import { Genre } from '../../../environment/Genre';

@Component({
  selector: 'app-registrar-pelicula',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-pelicula.component.html',
  styleUrl: './registrar-pelicula.component.css'
})
export class RegistrarPeliculaComponent {
  Title: string = '';
  Overview: string = '';
  ReleaseDate?: string;
  PosterPath?: string;
  BackdropPath?: string;
  Rating?: number;
  VoteCount?: number;
  Duration?: number;
  MovieGenres: any[] = [];
  selectedGenres: number[] = []; // Para almacenar los IDs de los géneros seleccionados
  imageOption: string = 'upload'; // Default option
  genres: Genre[] = [];
  genreService: any;
  MovieId?: number;

  constructor(private api: BuscadorPeliculasService) {
   }

  ngOnInit() {
    this.api.getGenres().subscribe(
      (response: any) => {
        if (Array.isArray(response.$values)) {
          this.genres = response.$values;
        } else {
          console.error('La respuesta de géneros no es un arreglo:', response);
        }
      },
      (error) => {
        console.error('Error al obtener géneros', error);
      }
    );
  }


  addPelicula(form: NgForm) {
    const peli: PeliculaData = {
      movieId: this.MovieId ?? 0,  // Proporciona un valor predeterminado si es undefined
      title: this.Title,
      overview: this.Overview,
      releaseDate: this.ReleaseDate,
      posterPath: this.PosterPath,
      backdropPath: this.BackdropPath,
      rating: this.Rating,
      voteCount: this.VoteCount,
      duration: this.Duration,
      movieGenres: this.selectedGenres.map((genreId) => ({ genreId: genreId }))
    };
  
    this.api.addPelicula(peli).subscribe(
      (response: PeliculaData) => {
        console.log('Película añadida exitosamente', response);
        
        // Asegúrate de que response.movieId esté definido
        if (response.movieId !== undefined) {
          console.log('MovieId encontrado:', response.movieId);
          this.selectedGenres.forEach((genreId) => {
            // Asegúrate de que genreId no sea undefined
            if (genreId !== undefined) {
              this.api.addGenresToMovie(response.movieId, genreId).subscribe(
                () => {
                  console.log('Género añadido a la película');
                  this.resetForm();
                },
                error => console.error('Error al añadir género a la película', error)
              );
            } else {
              console.error('Id de género no definido');
            }
          });
        } else {
          console.error('MovieId no encontrado en la respuesta');
        }
      },
      error => console.error('Error al añadir película', error)
    );
  }
  
  
  

  
  
  private resetForm() {
    this.Title = '';
    this.Overview = '';
    this.ReleaseDate = undefined;
    this.PosterPath = undefined;
    this.BackdropPath = undefined;
    this.Rating = undefined;
    this.VoteCount = undefined;
    this.Duration = undefined;
    this.MovieGenres = [];
    this.selectedGenres = [];

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.PosterPath = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
}

