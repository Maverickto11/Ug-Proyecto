// pelicula.model.ts

import { Data } from "@angular/router";
import { Genre } from "./Genre";
import { MovieGenre } from "./MovieGenre";

export interface PeliculaData {
  movieId: number;  
  title: string;
  overview: string;
  ReleaseDate?: string;
  posterPath?: string;
  backdropPath?: string;
  rating?: number;
  voteCount?: number;
  Trailer?: string;
  duration?: number;
  //movieGenres?: { genreId: number }[]; // Asegúrate de que este campo coincida si es necesario
  movieGenres?: MovieGenre[];
 
}

  