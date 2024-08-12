import { PeliculaData } from "./PeliculaData";
import { SerieData } from "./SerieData";
import { Usuario } from "./Usuario";

export interface Comentario {
    id: number;
    contenido: string;
    fecha: Date;
    usuarioId: number;
    usuario: Usuario;
    movieId?: number;
    movie?: PeliculaData;
    seriesId?: number;
    series?: SerieData;
  }