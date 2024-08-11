import { Component } from '@angular/core';
import { Genre } from '../../../../environment/Genre';
import { BuscadorPeliculasService } from '../../../../Services/api.service';
import { SerieData } from '../../../../environment/SerieData';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registrar-series',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrar-series.component.html',
  styleUrl: './registrar-series.component.css'
})
export class RegistrarSeriesComponent {
  Title: string = '';
  Overview: string = '';
  ReleaseDate?: Date;
  PosterPath: string = '';
  BackdropPath?: string;
  Rating?: number;
  VoteCount?: number;
  NumberOfSeasons?: number;
  NumberOfEpisodes?: number;
  Trailer?: string;
  Tipo?: string;
  SeriesGenres: any[] = [];
  selectedGenres: number[] = []; // Para almacenar los IDs de los géneros seleccionados
  imageOption: string = 'upload'; // Default option
  genres: Genre[] = [];
  genreService: any;
  SeriesId?: number;

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

  addSerie() {
    const serie: SerieData = {
      seriesId: this.SeriesId ?? 0,  // Proporciona un valor predeterminado si es undefined
      title: this.Title,
      overview: this.Overview,
      releaseDate: this.ReleaseDate,
      posterPath: this.PosterPath,
      backdropPath: this.BackdropPath,
      rating: this.Rating,
      voteCount: this.VoteCount,
      numberOfSeasons: this.NumberOfSeasons,
      numberOfEpisodes: this.NumberOfEpisodes,
      trailer: this.Trailer,
      tipo: this.Tipo,
      //seriesGenres: this.selectedGenres.map((genreId) => ({ genreId }))
    };

    this.api.addSerie(serie).subscribe(
      (response) => {
        console.log('Serie añadida:', response);
        if (response.seriesId !== undefined) {
          console.log('SerieId encontrado:', response.seriesId);
          this.selectedGenres.forEach((genreId) => {
            // Asegúrate de que genreId no sea undefined
            if (genreId !== undefined) {
              this.api.addGenresToSeries(response.seriesId, genreId).subscribe(
                () => {
                  console.log('Género añadido a la Serie');
                  this.resetForm();
                },
                error => console.error('Error al añadir género a la Serie', error)
              );
            } else {
              console.error('Id de género no definido');
            }
          });
        } else {
          console.error('MovieId no encontrado en la respuesta');
        }
      },
      error => console.error('Error al añadir Serie', error)
    );
  }

  resetForm() {
    this.Title = '';
    this.Overview = '';
    this.ReleaseDate = undefined;
    this.PosterPath = '';
    this.BackdropPath = '';
    this.Rating = undefined;
    this.VoteCount = undefined;
    this.NumberOfSeasons = undefined;
    this.NumberOfEpisodes = undefined;
    this.Trailer = '';
    this.Tipo = '';
    this.SeriesGenres = [];
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
