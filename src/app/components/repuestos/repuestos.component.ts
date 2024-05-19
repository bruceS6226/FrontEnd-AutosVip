import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaDentroMarcasVehiculo, RepuestoCategoriaDentroMarcasVehiculo } from 'src/app/models/categoria.dentro.marcas.vehiculo';
import { Repuesto } from 'src/app/models/repuesto';
import { RepuestoService } from 'src/app/services/repuestos.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-repuestos',
  templateUrl: './repuestos.component.html',
  styleUrls: ['./repuestos.component.css']
})
export class RepuestosComponent implements OnInit {
  public repuestosCategoriasDentroMarcasVehiculo: RepuestoCategoriaDentroMarcasVehiculo[] = [];
  public categoriasDentroMarcasVehiculo: CategoriaDentroMarcasVehiculo[] = [];
  public categorias: string[] = [];
  public appUrl = environment.appUrl;
  public apiUrl = environment.apiUrl;
  public cantidadRepuestos: number = 0;
  public tamanioPagina: number = 12;
  public repuestosPorPagina: Repuesto[] = []
  public fotosPrincipales: string[] = [];
  public cargando: boolean = true;
  public timer: any;

  constructor(private _repuestoService: RepuestoService, private route: ActivatedRoute, private router: Router) {
    this._repuestoService.actualizarRepuestos$.subscribe({
      next: () => {
        this.spinnerCargando()
      },
    })
  }

  ngOnInit(): void {
    this.spinnerCargando()
    if (this.route.firstChild) {
      this.route.firstChild.url.subscribe(segments => {
        if (segments.length > 0) {
          this.categorias = segments.map(segment => segment.path);
          this.obtenerRepuestosPorCategoriasDentroMarcasVehiculo(0, this.tamanioPagina);
          this.obtenerFotosRepuestosPorCategoriasDentroMarcasVehiculo(0, this.tamanioPagina);
          this.obtenerCantidadRepuestosPorCategoriasDentroMarcasVehiculo(this.categorias);
        } else {
          this.obtenerPocosRepuestos(0, this.tamanioPagina);
          this.obtenerPocasFotosPrincipales(0, this.tamanioPagina);
          this.obtenerCantidadRepuestos();
        }
      });
      this.volverArriba();
    } else {
      this.obtenerPocosRepuestos(0, this.tamanioPagina);
      this.obtenerPocasFotosPrincipales(0, this.tamanioPagina);
      this.obtenerCantidadRepuestos();
    }
    this.obtenerRepuestosCategoriasDentroMarcasVehiculo();
    this.obtenerTodasCategorias();
  }

  spinnerCargando() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    if (!this.cargando) {
      this.cargando = true;
      this.volverArriba();
    }
    this.timer = setTimeout(() => {
      if (this.cargando) {
        this.cargando = false
      }
    }, 900)
  }
  volverArriba() {
    const container = document.querySelector('.container') as HTMLElement;
    var posicion = container.offsetTop - 90;
    if (this.route.firstChild) {
      posicion = 0;
    }
    console.log(posicion)
    window.scroll({
      top: posicion,
      left: 0,
      behavior: 'smooth'
    });
  }
  pageChanged(event: any) {
    this.spinnerCargando();
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    if (this.categorias.length > 0) {
      this.obtenerRepuestosPorCategoriasDentroMarcasVehiculo(startIndex, endIndex);
      this.obtenerFotosRepuestosPorCategoriasDentroMarcasVehiculo(startIndex, endIndex);
    } else {
      this.obtenerPocosRepuestos(startIndex, endIndex);
      this.obtenerPocasFotosPrincipales(startIndex, endIndex);
    }
  }
  obtenerCantidadRepuestos() {
    this._repuestoService.obtenerCantidadRepuestos().subscribe({
      next: (value) => {
        this.cantidadRepuestos = value
      },
    })
  }
  obtenerCantidadRepuestosPorCategoriasDentroMarcasVehiculo(categorias: string[]) {
    this._repuestoService.obtenerCantidadRepuestosPorCategoriasDentroMarcasVehiculo(categorias).subscribe({
      next: (value) => {
        this.cantidadRepuestos = value
      },
    })
  }
  obtenerRepuestosCategoriasDentroMarcasVehiculo() {
    this._repuestoService.obtenerRepuestosCategoriasDentroMarcasVehiculo().subscribe({
      next: (value) => {
        this.repuestosCategoriasDentroMarcasVehiculo = value;
      },
    })
  }
  buscarRepuestoCategoriaDentroMarcasVehiculo(id_repuesto: string) {
    const id_categoria_dentro_marcas_vehiculo = this.idCategoriaDentroMarcasPorRepuesto(id_repuesto);
    if (id_categoria_dentro_marcas_vehiculo) {
      const categoriaEncontrada = this.categoriasDentroMarcasVehiculo.find(
        categoria => categoria.id_categoria_dentro_marcas_vehiculo === id_categoria_dentro_marcas_vehiculo
      )
      return categoriaEncontrada?.nombre_categoria_dentro_marcas_vehiculo
    } else {
      return null;
    }
  }
  idCategoriaDentroMarcasPorRepuesto(id_repuesto: string) {
    for (const repuesto of this.repuestosCategoriasDentroMarcasVehiculo) {
      if (repuesto.id_repuesto === id_repuesto) {
        return repuesto.id_categoria_dentro_marcas_vehiculo;
      }
    }
    return null;
  }
  obtenerPocosRepuestos(inicio: number, fin: number) {
    this._repuestoService.obtenerPocosRepuestos(inicio, fin).subscribe({
      next: (value) => {
        this.repuestosPorPagina = value;
      },
    })
  }
  obtenerRepuestosPorCategoriasDentroMarcasVehiculo(inicio: number, fin: number) {
    this._repuestoService.obtenerRepuestosPorCategoriasDentroMarcasVehiculo(inicio, fin, this.categorias).subscribe({
      next: (value) => {
        this.repuestosPorPagina = value;
      },
    })
  }
  obtenerTodasCategorias() {
    this._repuestoService.obtenerCategoriasDentroMarcasVehiculos().subscribe({
      next: (value) => {
        this.categoriasDentroMarcasVehiculo = value;
      },
    })
  }
  obtenerPocasFotosPrincipales(inicio: number, fin: number) {
    this._repuestoService.obtenerPocasFotosPrincipales(inicio, fin).subscribe({
      next: (value) => {
        this.fotosPrincipales = value
      },
    })
  }
  obtenerFotosRepuestosPorCategoriasDentroMarcasVehiculo(inicio: number, fin: number) {
    this._repuestoService.obtenerFotosRepuestosPorCategoriasDentroMarcasVehiculo(inicio, fin, this.categorias).subscribe({
      next: (value) => {
        this.fotosPrincipales = value
      },
    })
  }
  agregarAlCarrito(repuesto: Repuesto) {
    var repuestosSeleccionadosParaCompra = []
    const repuestosJson = localStorage.getItem('repuestosSeleccionadosParaCompra')
    if (repuestosJson) {
      repuestosSeleccionadosParaCompra = JSON.parse(repuestosJson)
    }
    repuestosSeleccionadosParaCompra.push(repuesto);
    localStorage.setItem('repuestosSeleccionadosParaCompra', JSON.stringify(repuestosSeleccionadosParaCompra));
    this._repuestoService.notificarActualizacionHeader();
  }
}
