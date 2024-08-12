
import { Genre } from "./Genre";
import { MovieGenre } from "./MovieGenre";

export interface SerieData {
  [x: string]: any;
    seriesId: number;
  title: string;
  releaseDate?: string;
  overview: string;
  posterPath: string;
  backdropPath?: string;
  rating?: number;
  voteCount?: number;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  trailer?: string;
  tipo?: string;
  movieGenres?: MovieGenre[];

  }