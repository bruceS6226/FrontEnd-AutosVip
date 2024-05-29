import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Repuesto } from 'src/app/models/repuesto';
import { RepuestoService } from 'src/app/services/repuestos.service';
import { environment } from 'src/environment/environment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

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
    private router: Router, private dialog: MatDialog,) {
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
        total += repuesto.precio_PVP * cantidadActual;
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
        total += repuesto.precio_PVP * cantidadActual;
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
        total += repuesto.precio_PVP * cantidadActual;
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

  crearPDF() {
    const data = document.getElementById('cotizacion');
    if (data) {
      html2canvas(data, {
        onclone: (clonedDoc) => {
          clonedDoc.querySelectorAll('.no-print').forEach(element => {
            (element as HTMLElement).style.display = 'none';
          });
        }
      }).then(canvas => {
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const topMargin = 5;
        const imageMargin = topMargin + 5;
        const rucMargin = imageMargin + 20;
        const paisMargin = rucMargin + 5;
        const whspMargin = paisMargin + 5;
        const tablePosition = whspMargin + 10;
        pdf.setFontSize(12);
        const pageWidth = pdf.internal.pageSize.getWidth();

        const logoURL = '../../../assets/img/logo.png';
        const logoWidth = 25;
        const logoHeight = 15;
        const centroImagen = (pageWidth - logoWidth) / 2;
        pdf.addImage(logoURL, 'PNG', centroImagen, imageMargin, logoWidth, logoHeight);

        const ruc = 'RUC: 1793190517001';
        const rucWidth = pdf.getTextWidth(ruc);
        const rucPosition = (pageWidth - rucWidth) / 2;
        pdf.text(ruc, rucPosition, rucMargin);

        const pais = 'ECUADOR';
        const paisWidth = pdf.getTextWidth(pais);
        const paisPosition = (pageWidth - paisWidth) / 2;
        pdf.text(pais, paisPosition, paisMargin);

        const whsp = 'WHATSAPP 0999900223';
        const whspWidth = pdf.getTextWidth(whsp);
        const whspPosition = (pageWidth - whspWidth) / 2;
        pdf.text(whsp, whspPosition, whspMargin);

        pdf.addImage(contentDataURL, 'PNG', 0, tablePosition, imgWidth, imgHeight);
        pdf.save('cotizacion.pdf');
      });
    }
  }


  abrirDialogIniciarSesion(): void {
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