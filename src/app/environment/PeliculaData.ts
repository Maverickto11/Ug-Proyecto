// pelicula.model.ts

export class PeliculaData {
  Title: string;
  Overview: string;
  ReleaseDate?: string;
  PosterPath?: string;
  BackdropPath?: string;
  Rating?: number;
  VoteCount?: number;
  Duration?: number;
  MovieGenres?: any[];

  constructor(Title: string = '', Overview: string = '', ReleaseDate?: string, PosterPath?: string, BackdropPath?: string, Rating?: number, VoteCount?: number, Duration?: number, MovieGenres?: any[]) {
      this.Title = Title;
      this.Overview = Overview;
      this.ReleaseDate = ReleaseDate;
      this.PosterPath = PosterPath;
      this.BackdropPath = BackdropPath;
      this.Rating = Rating;
      this.VoteCount = VoteCount;
      this.Duration = Duration;
      this.MovieGenres = MovieGenres;
  }
}
  