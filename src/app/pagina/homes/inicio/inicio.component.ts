import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BuscadorPeliculasService } from '../../../Services/api.service';
import { CommonModule } from '@angular/common';
import { timer } from 'rxjs';
import { Route, Router } from '@angular/router';
import { FooterComponent } from "../../footer/footer.component";

@Component({
    selector: 'app-inicio',
    standalone: true,
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.css',
    imports: [CommonModule, FooterComponent]
})
export class InicioComponent implements OnInit {

  bannnerApi: any = []; // Declare the 'bannnerApi' property
  timerSubscription: any;
  generos: any[] = [];
  lisGenero: any;
  tendencias: any[] = [];
  constructor(private api: BuscadorPeliculasService, private router: Router) { }
  currentIndex = 0;
  interval = 5000;
  isAtStart = true;
  isAtEnd = false;
  terrorMoviesAndSeries: any;
  ActionMoviesAndSeries: any;  

  @ViewChild('getterror') getterror!: ElementRef;
  @ViewChild('Action') Action!: ElementRef;
  @ViewChild('container') container!: ElementRef;
  @ViewChild('containerProximamente') containerProximamente!: ElementRef;

  ngOnInit() {
    this.bannerData();
    this.startAutoPlay();
    this.getPopularPeliculas();
    this.gettendencias();
    this.buscarPeliculasDeTerror();
    this.buscarPeliculasDeAction();
  }

  ngOnDestroy() {
    // Cancelar la suscripción al destruir el componente para evitar fugas de memoria
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  bannerData() {
    this.api.bannerApiData().subscribe((result) => {
      console.log(result, 'inicio#');
      this.bannnerApi = result.results;
    },
      error => {
        console.error('Error fetching movies:', error);
      }
    );

  }

  getPopularPeliculas() {
    this.api.getPopular().subscribe((result) => {
      this.generos = result.results;
      console.log(this.generos, 'generos');
    },
      error => {
        console.error('Error fetching movies:', error);
      }
    );
  }

  gettendencias() {
    this.api.tendencias().subscribe((result) => {
      this.tendencias = result.results;
      console.log(this.tendencias, 'proximo');
    },
    );
  }

  nextImage() {
    if (this.bannnerApi.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.bannnerApi.length;
    }
  }

  updateButtonStates(container: ElementRef) {
    if (container) {
      const isAtStart = container.nativeElement.scrollLeft === 0;
      const isAtEnd = container.nativeElement.scrollLeft + container.nativeElement.offsetWidth >= container.nativeElement.scrollWidth;
      return { isAtStart, isAtEnd };
    }
    return { isAtStart: true, isAtEnd: false }; // Si el contenedor no está disponible, devuelve valores predeterminados
  }

  
  prevImage() {
    if (this.bannnerApi.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.bannnerApi.length) % this.bannnerApi.length;
    }
  }

  truncatedOverview(overview: string, index: number): string {
    const maxLength = 100; // Longitud máxima del texto a mostrar inicialmente
    return this.bannnerApi[index].showFullOverview ? overview : (overview.length > maxLength ? overview.substring(0, maxLength) + '...' : overview);
  }

  toggleOverview(index: number) {
    this.bannnerApi[index].showFullOverview = !this.bannnerApi[index].showFullOverview;
  }

  isOverMaxLength(overview: string, index: number): boolean {
    const maxLength = 100; // Longitud máxima del texto a mostrar inicialmente
    return overview.length > maxLength && !this.bannnerApi[index].showFullOverview;
  }

  startAutoPlay() {
    // Inicia el autoplay configurando un temporizador para llamar a nextImage() cada 'interval' milisegundos
    this.timerSubscription = timer(0, this.interval).subscribe(() => {
      this.nextImage();
    });
  }

  detalle(tipo: string, id: number) {
    this.router.navigate(['detalle', tipo, id]);
  }

  detallePelicula(id: number) {
    this.router.navigate(['detallesPeliculas', id]);
  }

  scroll(direction: 'left' | 'right', containerType: 'tendencias' | 'proximamente' | 'getterror' | 'Action') {
    const containers = {
      'tendencias': this.container,
      'proximamente': this.containerProximamente,
      'getterror': this.getterror,
      'Action': this.Action
    };
  
    const container = containers[containerType];
  
    if (container) {
      const distance = direction === 'left' ? -200 : 200;
      container.nativeElement.scrollLeft += distance;
      const { isAtStart, isAtEnd } = this.updateButtonStates(container);
      this.isAtStart = isAtStart;
      this.isAtEnd = isAtEnd;
    }
  }
  

  buscarPeliculasDeTerror() {
    const busqueda = 'Horror';
    const idGenero = '27'; // Convert the number array to a string array
    this.api.buscarTerror(idGenero ,busqueda).subscribe(
      (result) => {
        console.log('Películas y series de terror:', result);
        this.terrorMoviesAndSeries = result; // Asignar los resultados a la propiedad

        // Aquí puedes manejar los resultados obtenidos, como asignarlos a una propiedad del componente para mostrar en la plantilla
      },
      (error) => {
        console.error('Error al buscar películas y series de terror:', error);
        // Maneja el error según sea necesario
      }
    );
  }

  buscarPeliculasDeAction() {
    const busqueda = 'Action';
    const idGenero = '28'; 
    this.api.buscarAction(idGenero ,busqueda).subscribe(
      (result) => {
        console.log('Películas y series de terror:', result);
        this.ActionMoviesAndSeries = result; // Asignar los resultados a la propiedad

        // Aquí puedes manejar los resultados obtenidos, como asignarlos a una propiedad del componente para mostrar en la plantilla
      },
      (error) => {
        console.error('Error al buscar películas y series de terror:', error);
        // Maneja el error según sea necesario
      }
    );
  }
}
