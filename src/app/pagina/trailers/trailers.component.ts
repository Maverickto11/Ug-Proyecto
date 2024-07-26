import { Component, Inject, Input, OnInit } from '@angular/core';
import { BuscadorPeliculasService } from '../../Services/api.service';
import { Route, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-trailers',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './trailers.component.html',
  styleUrl: './trailers.component.css'
})
export class TrailersComponent implements OnInit{
  trailerKey: any[] = [];
  movieId: number | undefined;
  safeURL: SafeResourceUrl | undefined;
  mensajeNoVideo: string = '';
  videoUrl: any;

  constructor(private api: BuscadorPeliculasService, private route: ActivatedRoute, 
    private sanitizer: DomSanitizer, private dialogRef: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
  }

  ngOnInit(): void {
    if (this.data && this.data.id && this.data.tipo) {
      this.movieId = this.data.id;
      this.getTrailer(this.data.tipo); // Pasa el tipo de contenido a la función getTrailer
    }
  }

  private getTrailer(tipo: string): void {
    if (this.movieId && tipo) {
      const apiCall = tipo === 'movie' ? this.api.trailers(this.movieId) : this.api.trailerSerie(this.movieId);
      apiCall.subscribe(response => {
        let ultimoTrailerKey = null;
        for (let i = response.results.length - 1; i >= 0; i--) {
          if (response.results[i].type === 'Trailer') {
            ultimoTrailerKey = response.results[i].key;
            break;
          }
        }
        if (ultimoTrailerKey) {
          this.setVideoIframe(ultimoTrailerKey);
        } else {
          this.mensajeNoVideo = 'Todavía no ha salido el tráiler para esta película o serie.';
        }
      });
    }
  }

  private setVideoIframe(trailerKey: string): void {
    // Construir la URL del video de YouTube
    this.videoUrl = 'https://www.youtube.com/embed/' + trailerKey + '?autoplay=1';
    // Sanitizar la URL para evitar problemas de seguridad
    this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
  }
  
}
