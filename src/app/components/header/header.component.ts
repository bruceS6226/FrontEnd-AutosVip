import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { Repuesto } from 'src/app/models/repuesto';
import { RepuestoService } from 'src/app/services/repuestos.service';
import { environment } from 'src/environment/environment';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public appUrl = environment.appUrl;
  public apiUrl = environment.apiUrl;
  public repuestos: Repuesto[] = [];
  public repuestosFitradosNombre: Repuesto[] = [];
  public repuestosSeleccionadosParaCompra: Repuesto[] = []
  public textoBuscar: string = '';
  public foto: string = '';
  public cantidadRepuestosSeleccionadosParaComprar: number = 0;
  private subscription: Subscription;
  private timer: any;

  constructor(private _repuestoService: RepuestoService, private route: ActivatedRoute,
    private router: Router, private dialog: MatDialog,) {
    this.subscription = this._repuestoService.actualizarHeader$.subscribe({
      next: () => {
        this.ngOnInit();
      },
    });
  }
  ngOnInit(): void {
    this.obtenerTodosRepuestos()
    this.obtenerRepuestosSeleccionadosParaComprar();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  obtenerRepuestosSeleccionadosParaComprar() {
    const repuestosJson = localStorage.getItem('repuestosSeleccionadosParaCompra');
    if (repuestosJson) {
      try {
        this.repuestosSeleccionadosParaCompra = JSON.parse(repuestosJson)
        this.cantidadRepuestosSeleccionadosParaComprar = this.repuestosSeleccionadosParaCompra.length
      } catch (error) {
        console.error('Error al analizar los datos del localStorage:', error);
      }
    } else {
      this.repuestosSeleccionadosParaCompra = [];
      this.cantidadRepuestosSeleccionadosParaComprar = this.repuestosSeleccionadosParaCompra.length
    }
  }

  public nombresMap = new Map<string, Repuesto>();
  filterRepuestos(value: string) {
    const palabrasComunes = [
      'de', 'para', 'y', 'la', 'el', 'es', 'un', 'una', 'en', 'con', 'por', 'a', 'los', 
      'las', 'al', 'del', 'se', 'lo', 'como', 'más', 'o', 'pero', 'sus', 'le', 'ha', 
      'me', 'si', 'sin', 'sobre', 'este', 'ya', 'entre', 'cuando', 'todo', 'esta', 
      'ser', 'son', 'dos', 'también', 'fue', 'había', 'muy', 'hasta', 'desde', 'nos', 
      'durante', 'uno', 'ni', 'ese', 'contra', 'sí', 'porque', 'qué', 'está', 'ante', 
      'e', 'les', 'estos', 'algunos', 'cual', 'poco', 'ella', 'esto', 'esos', 'esas', 
      'algunas', 'algo', 'nosotros', 'vosotros', 'vosotras', 'ellos', 'ellas', 'míos', 
      'tuyo', 'tus', 'mías', 'tuyas', 'nuestros', 'vuestra', 'vuestros', 'vuestro', 
      'mío', 'mi', 'nuestra', 'nuestras', 'nuestros', 'tuyo', 'tuyos', 'vuestro', 
      'vuestra', 'vuestros', 'vuestras'
  ]; // Lista de palabras no claves
    const filterValue = value.toLowerCase();
    const palabras = filterValue.split(' ').filter(palabra => palabra.trim() !== '' && !palabrasComunes.includes(palabra));

    this.repuestos.forEach(repuesto => this.nombresMap.set(repuesto.nombre_repuesto, repuesto));
    this.repuestosFitradosNombre = Array.from(this.nombresMap.values());

    this.repuestosFitradosNombre = this.repuestosFitradosNombre.filter(repuesto => {
        // Filtrar cada repuesto solo si incluye todas las palabras clave
        return palabras.every(palabra => repuesto.nombre_repuesto.toLowerCase().includes(palabra));
    });
}

  @ViewChild('input', { read: MatAutocompleteTrigger }) autoTrigger!: MatAutocompleteTrigger;

  buscar(textoBuscar: string) {
      this.autoTrigger.closePanel();
    this.router.navigateByUrl(`/search?s=${textoBuscar}`)
    this._repuestoService.notificarActualizacionSearch()
    //window.location.href = `/search?s=${this.textoBuscar}`;
  }
  obtenerImagenPrincipal(id_repuesto: string) {
    this._repuestoService.obtenerFotoPrincipal(id_repuesto).subscribe({
      next: (value) => {
        return `${this.appUrl}${this.apiUrl}/${value}`
      },
    })
  }
  onInputChange() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      if (this.textoBuscar) {
        this.filterRepuestos(this.textoBuscar);
      } else {
        this.repuestos = [];
        this.repuestosFitradosNombre = [];
      }
    }, 400);
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const repuesto = this.repuestosFitradosNombre.find(r => r.nombre_repuesto === event.option.value);
    if (repuesto) {
      window.location.href = `/repuesto/${repuesto.id_repuesto}`;
    }
  }

  calcularTotal(): number {
    let total = 0.0;
    for (const repuesto of this.repuestosSeleccionadosParaCompra) {
      total += Number(repuesto.precio_PVP);
    }
    return total;
  }
  borrarRepuestosSeleccionadosParaCompra() {
    localStorage.removeItem('repuestosSeleccionadosParaCompra');
    this._repuestoService.notificarActualizacionHeader()
    this._repuestoService.notificarDetalleCarrito();
  }

  obtenerTodosRepuestos() {
    this._repuestoService.obtenerRepuestos().subscribe({
      next: (value) => {
        this.repuestos = value;
        value.forEach(repuesto => this.nombresMap.set(repuesto.nombre_repuesto, repuesto));
      },
    })
  }

  eliminarDelCarrito(repuesto: Repuesto) {
    let repuestosSeleccionadosParaCompra = [];
    const repuestosJson = localStorage.getItem('repuestosSeleccionadosParaCompra');
    if (repuestosJson) {
      repuestosSeleccionadosParaCompra = JSON.parse(repuestosJson);
      const index = repuestosSeleccionadosParaCompra.findIndex((item: Repuesto) => item.id_repuesto === repuesto.id_repuesto);
      if (index !== -1) {
        repuestosSeleccionadosParaCompra.splice(index, 1);
        localStorage.setItem('repuestosSeleccionadosParaCompra', JSON.stringify(repuestosSeleccionadosParaCompra));
        this._repuestoService.notificarActualizacionHeader();
        this._repuestoService.notificarDetalleCarrito();
      }
    }
  }
  
  abrirDialogIniciarSesion(): void {
    const offcanvasElement = document.getElementById('carritoCompras');
    if (offcanvasElement) {
      const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (offcanvas) {
        offcanvas.hide();
      }
    }
    const dialogRef = this.dialog.open(ContenidoDialogoIniciarSesion, {
      width: '40%',
    });
    dialogRef.afterClosed().subscribe();
  }
}


@Component({
  selector: 'dialog-content',
  template: `
    <h1 mat-dialog-title>Inicio de sesión requerido</h1>
    <mat-dialog-content class="mat-typography">
    Debe iniciar sesión para acceder, pero aún no contamos con la página de registro, 
    estamos trabajando en ello para brindarle una mejor experiencia. <b>Gracias por su comprensión.</b>
    </mat-dialog-content>
    <mat-dialog-actions class="" align="end">
      <button color="primary" mat-raised-button mat-dialog-close cdkFocusInitial>OK</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ContenidoDialogoIniciarSesion { }