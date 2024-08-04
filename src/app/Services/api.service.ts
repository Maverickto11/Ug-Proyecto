import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, tap, throwError } from 'rxjs';
import { environment } from '../environment/environment';
import { PeliculaData } from '../environment/PeliculaData';
import { Genre } from '../environment/Genre';
@Injectable({
  providedIn: 'root'
})
export class BuscadorPeliculasService {
  private apiUrl = 'https://localhost:7169/api';

  constructor(private http: HttpClient) { }
/* 
bannerApiData(): Observable<any> {
    return this.http.get(`${environment.url}/trending/all/week?api_key=${environment.apiKey}`);
  }
*/
  bannerApiData(): Observable<any> {
    return this.http.get(`${environment.url2}`);
  }
 
  addPelicula(peliculaData: PeliculaData): Observable<PeliculaData> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<PeliculaData>(`${environment.url2}`, peliculaData);
  }
  getGenres(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Genres`);  // Asegúrate de que la ruta aquí coincida con la ruta del controlador
  }
  


  /*addGenresToMovie(movieId: number, genreId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/Genres/${movieId}/genres`, genreId);
  }*/

    addGenresToMovie(movieId: number, genreId: number): Observable<void> {
  if (movieId === undefined || genreId === undefined) {
    return throwError('movieId o genreId no definidos');
  }
  return this.http.post<void>(`${this.apiUrl}/Genres/${movieId}/genres`, genreId);
}

login(credentials: { email: string, password: string }): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/Login/login`, credentials);
}

    
    

    /*addGenresToMovie(movieId: number, genreIds: number[]): Observable<void> {
      return this.http.post<void>(`${this.apiUrl}/Genres/${movieId}/genres`, genreIds);
    }*/
    
  

  getMovies(number: number): Observable<any> {
    const url = `${environment.url}/discover/movie?api_key=${environment.apiKey}&page=${number}`;
    return this.http.get<any>(url);
  }

  getSeries(number: number): Observable<any> {
    const url = `${environment.url}/discover/tv?api_key=${environment.apiKey}&page=${number}`;
    return this.http.get<any>(url);
  }

  /*tendencias(): Observable<any> {
    const url = `${environment.url}/trending/all/day?api_key=${environment.apiKey}`;
    return this.http.get<any>(url);
  }*/

    tendencias(): Observable<any> {
      const url = `${environment.url2}`;
      return this.http.get<any>(url);
    }


  trailers(id: number): Observable<any> {
    const url = `${environment.url}/movie/${id}/videos?api_key=${environment.apiKey}`;
    return this.http.get<any>(url);
  }
  trailerSerie(id: number): Observable<any> {
    const url = `${environment.url}/tv/${id}/videos?api_key=${environment.apiKey}`;
    return this.http.get<any>(url);
  }

  getDetallesPelicula(id: number): Observable<any> {
    const url = `${environment.url}/movie/${id}?api_key=${environment.apiKey}`;
    return this.http.get<any>(url);
  }

  getDetallesSerie(id: number): Observable<any> {
    const url = `${environment.url}/tv/${id}?api_key=${environment.apiKey}`;
    return this.http.get<any>(url);
  }

  getPopular(): Observable<any> {
    return this.http.get(`${environment.url}/movie/upcoming?api_key=${environment.apiKey}`);
  }

  buscarSugerencias(busqueda: string): Observable<{ title: string, imageUrl: string, id: number, tipo: string }[]> {
    const url = `${environment.url}/search/multi?api_key=${environment.apiKey}&query=${busqueda}`;
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        const movies = response.results || [];
        return movies.map((movie: any) => ({ // Explicar explícitamente el tipo del parámetro 'movie' como 'any'
          id: movie.id,
          title: movie.title || movie.name || movie.original_name,
          imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '', // Construye la URL completa de la imagen si está disponible
          tipo: movie.media_type // Agrega el tipo de contenido al resultado
        }));
      })
    );
  }
  
  getDetalle(id: number, mediaType: string): Observable<any> {
    const tipo = mediaType === 'tv' ? 'tv' : 'movie'; // Determinar si el contenido es una película o una serie
    const url = `${environment.url}/${tipo}/${id}?api_key=${environment.apiKey}`;
    return this.http.get<any>(url);
  }

  buscarTerror(idGenero: string,busqueda: string): Observable<{ title: string, imageUrl: string, id: number, tipo: string }[]> {
    const peliculasTerrorUrl = `${environment.url}/discover/movie?api_key=${environment.apiKey}&with_genres=${idGenero}&query=${busqueda}`;
    const seriesTerrorUrl = `${environment.url}/discover/tv?api_key=${environment.apiKey}&with_genres=${idGenero}&query=${busqueda}`;
  
    const peliculasObs = this.http.get<any>(peliculasTerrorUrl).pipe(
      map((response: any) => {
        const movies = response.results || [];
        return movies.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
          tipo: 'movie'
        }));
      })
    );
  
    const seriesObs = this.http.get<any>(seriesTerrorUrl).pipe(
      map((response: any) => {
        const series = response.results || [];
        return series.map((serie: any) => ({
          id: serie.id,
          title: serie.name,
          imageUrl: serie.poster_path ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` : '',
          tipo: 'tv'
        }));
      })
    );
  
    // Combinar las observables de películas y series para obtener un solo flujo de datos
    return forkJoin([peliculasObs, seriesObs]).pipe(
      map(([peliculas, series]) => {
        // Combinar resultados de películas y series en un solo arreglo
        return [...peliculas, ...series];
      })
    );
  }
  
  buscarAction(idGenero: string,busqueda: string): Observable<{ title: string, imageUrl: string, id: number, tipo: string }[]> {
    const peliculasTerrorUrl = `${environment.url}/discover/movie?api_key=${environment.apiKey}&with_genres=${idGenero}&query=${busqueda}`;
    const seriesTerrorUrl = `${environment.url}/discover/tv?api_key=${environment.apiKey}&with_genres=${idGenero}&query=${busqueda}`;
  
    const peliculasObs = this.http.get<any>(peliculasTerrorUrl).pipe(
      map((response: any) => {
        const movies = response.results || [];
        return movies.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
          tipo: 'movie'
        }));
      })
    );
  
    const seriesObs = this.http.get<any>(seriesTerrorUrl).pipe(
      map((response: any) => {
        const series = response.results || [];
        return series.map((serie: any) => ({
          id: serie.id,
          title: serie.name,
          imageUrl: serie.poster_path ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` : '',
          tipo: 'tv'
        }));
      })
    );
  
    // Combinar las observables de películas y series para obtener un solo flujo de datos
    return forkJoin([peliculasObs, seriesObs]).pipe(
      map(([peliculas, series]) => {
        // Combinar resultados de películas y series en un solo arreglo
        return [...peliculas, ...series];
      })
    );
  }
}