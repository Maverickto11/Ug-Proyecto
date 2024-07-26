import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BuscadorPeliculasService } from '../../Services/api.service';
import { Params } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements AfterViewInit{
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }
  
  ngAfterViewInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  generatePageRange(): number[] {
    const range = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4); // Mostrar hasta 5 números de página

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Esto hará un scroll suave
    }
  }
  
  
  nextPage(event: Event): void {
    event.preventDefault(); // Evita la recarga de la página
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Esto hará un scroll suave

  }

  previousPage(event:Event): void {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Esto hará un scroll suave

  }

}
