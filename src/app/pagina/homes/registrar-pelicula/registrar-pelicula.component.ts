import { Component } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { NgForm } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PeliculaData } from '../../../environment/PeliculaData';
import { BuscadorPeliculasService } from '../../../Services/api.service';

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
  imageOption: string = 'upload'; // Default option

  constructor(private api: BuscadorPeliculasService) { }

  addPelicula() {
    const peli: PeliculaData = {
      Title: this.Title,
      Overview: this.Overview,
      ReleaseDate: this.ReleaseDate,
      PosterPath: this.PosterPath,
      BackdropPath: this.BackdropPath,
      Rating: this.Rating,
      VoteCount: this.VoteCount,
      Duration: this.Duration,
      MovieGenres: this.MovieGenres,
      
    };
    this.api.addPelicula(peli).subscribe(
      response => {
        console.log('Pelicula added successfully', response);
        this.resetForm();

      },
      error => {
        console.error('Error adding pelicula', error);
      }
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
