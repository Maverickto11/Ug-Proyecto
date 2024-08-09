export interface SerieData {
    seriesId: number;
  title: string;
  releaseDate?: Date;
  overview: string;
  posterPath: string;
  backdropPath?: string;
  rating?: number;
  voteCount?: number;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  trailer?: string;
  tipo?: string;
  seriesGenres?: { genreId: number }[]; // Asegúrate de que este campo coincida si es necesario

  }