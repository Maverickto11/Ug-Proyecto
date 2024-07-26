import { Component, OnInit } from '@angular/core';
import { BuscadorPeliculasService } from '../../Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TrailersComponent } from '../trailers/trailers.component';

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.css'
})
export class DetallesComponent implements OnInit {
  mostrarAviso: boolean = true;
  detalleGenero: any;
  currentDialogRef: MatDialogRef<any> | undefined;
  detalle: any;
  detallesPeli: string = '';
  id: number | undefined;
  constructor(private api: BuscadorPeliculasService, private router: ActivatedRoute, public dialog: MatDialog, private route: Router) { }

  ngOnInit(): void {
    this.Detalles();
  }

  private Detalles(): void {
    this.router.params.subscribe(params => {
      const id = +params['id']; // Convertir el ID a número
      const tipo = this.router.snapshot.data['tipo']; // Obtener el tipo de contenido de los datos de la ruta
      if(id && tipo){
        const apiDetalles = (tipo === 'movie') ? this.api.getDetallesPelicula(id) : this.api.getDetallesSerie(id);
        apiDetalles.subscribe(
          (result: any[]) => {
            this.detalle = result;
           console.log(this.detalle);
          });
      }
    });
  }

  portadaPelicula(): string {
    return `https://image.tmdb.org/t/p/original${this.detalle.poster_path}`;
  }

  fondoPelicula(): string {
    return `https://image.tmdb.org/t/p/original${this.detalle.backdrop_path}`;
  }

  openModal(): void {
    this.mostrarAviso = false;
    const dialogRef = this.dialog.open(TrailersComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data: { id: this.detalle.id, tipo: this.router.snapshot.data['tipo'] } // Pasa la ID y el tipo al abrir el modal
    });
  }
  

  closeModal(): void {
    // Cierra el modal si existe
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
      this.currentDialogRef = undefined; // Limpia la referencia
    }
  }

  trailerSeries(id: number) {
    this.route.navigate(['trailersPeliculas', id]);
  }
}
