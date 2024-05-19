import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { Repuesto } from 'src/app/models/repuesto';
import { RepuestoService } from 'src/app/services/repuestos.service';
import { environment } from 'src/environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detalle-carrito',
  templateUrl: './detalle-carrito.component.html',
  styleUrls: ['./detalle-carrito.component.css']
})
export class DetalleCarritoComponent implements OnInit {
  public appUrl = environment.appUrl;
  public apiUrl = environment.apiUrl;
  public repuestosSeleccionadosParaCompra: Repuesto[] = []
  public foto: string = '';
  public cantidadRepuestosSeleccionadosParaComprar: number = 0;
  public repuestoCantidades: Map<string, number> = new Map<string, number>();

  constructor(private _repuestoService: RepuestoService, private route: ActivatedRoute,
    private router: Router) {
    this._repuestoService.actualizarDetalleCarrito$.subscribe({
      next: () => {
        this.ngOnInit()
      },
    })
  }
  ngOnInit(): void {
    this.obtenerRepuestosSeleccionadosParaComprar();
    document.addEventListener("DOMContentLoaded", function () {
      const header = document.querySelector('.header') as HTMLElement;
      const headerHeight = header.offsetHeight + 30;
      const container = document.querySelector('.container') as HTMLElement;
      container.style.marginTop = headerHeight + 'px';
    });
  }
  obtenerRepuestosSeleccionadosParaComprar() {
    const repuestosJson = localStorage.getItem('repuestosSeleccionadosParaCompra');
    if (repuestosJson) {
      try {
        this.repuestosSeleccionadosParaCompra = JSON.parse(repuestosJson);
        this.cantidadRepuestosSeleccionadosParaComprar = this.repuestosSeleccionadosParaCompra.length
        this.repuestosSeleccionadosParaCompra.forEach(repuesto => {
          this.repuestoCantidades.set(repuesto.id_repuesto, 1);
        });
      } catch (error) {
        console.error('Error al analizar los datos del localStorage:', error);
      }
    } else {
      this.repuestosSeleccionadosParaCompra = [];
      this.cantidadRepuestosSeleccionadosParaComprar = this.repuestosSeleccionadosParaCompra.length
    }
  }
  obtenerImagenPrincipal(id_repuesto: string) {
    this._repuestoService.obtenerFotoPrincipal(id_repuesto).subscribe({
      next: (value) => {
        return `${this.appUrl}${this.apiUrl}/${value}`
      },
    })
  }

  calcularTotal(): number {
    let total = 0.0;
    for (const repuesto of this.repuestosSeleccionadosParaCompra) {
      const cantidadActual = this.repuestoCantidades.get(repuesto.id_repuesto);
      if (cantidadActual) {
        total += repuesto.precio_PVP*cantidadActual;
      } else {
      total += repuesto.precio_PVP;
      }
    }
    total = total * 1.15
    const aux = total.toFixed(2);
    total = Number(aux)
    return total;
  }

  calcularSubTotal(): number {
    let total = 0.0;
    for (const repuesto of this.repuestosSeleccionadosParaCompra) {
      const cantidadActual = this.repuestoCantidades.get(repuesto.id_repuesto);
      if (cantidadActual) {
        total += repuesto.precio_PVP*cantidadActual;
      } else {
      total += repuesto.precio_PVP;
      }
    }
    total = total
    const aux = total.toFixed(2);
    total = Number(aux)
    return total;
  }

  calcularIVA(indice: number): number {
    let total = 0.0;
    for (const repuesto of this.repuestosSeleccionadosParaCompra) {
      const cantidadActual = this.repuestoCantidades.get(repuesto.id_repuesto);
      if (cantidadActual) {
        total += repuesto.precio_PVP*cantidadActual;
      } else {
      total += repuesto.precio_PVP;
      }
    }
    total = total * (indice - 1)
    const aux = total.toFixed(2);
    total = Number(aux)
    return total;
  }

  aumentarCantidad(id_repuesto: string): void {
    const cantidadActual = this.repuestoCantidades.get(id_repuesto);
    if (cantidadActual) {
      this.repuestoCantidades.set(id_repuesto, cantidadActual + 1);
    }
  }

  disminuirCantidad(id_repuesto: string): void {
    const cantidadActual = this.repuestoCantidades.get(id_repuesto);
    if (cantidadActual && cantidadActual > 1) {
      this.repuestoCantidades.set(id_repuesto, cantidadActual - 1);
    }
  }

  borrarRepuestosSeleccionadosParaCompra() {
    localStorage.removeItem('repuestosSeleccionadosParaCompra');
    this._repuestoService.notificarActualizacionHeader()
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
}
