import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriaDentroMarcasVehiculo, RelacionMarcaVehiculo, RepuestoCategoriaDentroMarcasVehiculo } from 'src/app/models/categoria.dentro.marcas.vehiculo';
import { Repuesto } from 'src/app/models/repuesto';
import { RepuestoService } from 'src/app/services/repuestos.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-buscar-repuesto',
  templateUrl: './buscar-repuesto.component.html',
  styleUrls: ['./buscar-repuesto.component.css']
})
export class BuscarRepuestoComponent implements OnInit, OnDestroy {


  public repuestosCategoriasDentroMarcasVehiculo: RepuestoCategoriaDentroMarcasVehiculo[] = [];
  public categoriasDentroMarcasVehiculo: CategoriaDentroMarcasVehiculo[] = [];

  //public repuestosSugeridos: Repuesto[] = []
  public categorias: string[] = [];
  public appUrl = environment.appUrl;
  public apiUrl = environment.apiUrl;
  public foto: string = '';
  public textoBuscar: string = '';
  private subscription: Subscription;
  public cantidadRepuestos: number = 0;
  public tamanioPagina: number = 12;
  public repuestosPorPagina: Repuesto[] = []
  public fotosPrincipales: string[] = [];
  public cargando: boolean = true;
  public timer: any;

  constructor(private _repuestoService: RepuestoService, private route: ActivatedRoute,
    private router: Router) {
    this.subscription = this._repuestoService.actualizarSearch$.subscribe({
      next: () => {
        this.ngOnInit()
      },
    })
  }
  ngOnInit(): void {
    this.spinnerCargando()
    this.volverArriba();
    this.route.queryParams.subscribe(params => {
      this.textoBuscar = params['s'];
      this.buscarPocosRepuestos(0, this.tamanioPagina);
      this.buscarPocasFotosPrincipales(0, this.tamanioPagina);
      this.obtenerCantidadRepuestos();
    });
    this.obtenerRepuestosCategoriasDentroMarcasVehiculo();
    this.obtenerTodasCategorias();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    this.buscarPocosRepuestos(startIndex, endIndex);
    this.buscarPocasFotosPrincipales(startIndex, endIndex);
  }

  obtenerTodasCategorias() {
    this._repuestoService.obtenerCategoriasDentroMarcasVehiculos().subscribe({
      next: (value) => {
        this.categoriasDentroMarcasVehiculo = value;
      },
    })
  }
  buscarPocasFotosPrincipales(inicio: number, fin: number) {
    this._repuestoService.buscarPocasFotosPrincipales(inicio, fin, this.textoBuscar).subscribe({
      next: (value) => {
        this.fotosPrincipales = value.fotosRepuestos;
      },
    })
  }
  obtenerCantidadRepuestos() {
    this._repuestoService.buscarCantidadRepuestos(this.textoBuscar).subscribe({
      next: (value) => {
        this.cantidadRepuestos = value.cantidadRepuestos;
      },
    })
  }
  buscarPocosRepuestos(inicio: number, fin: number) {
    this._repuestoService.buscarPocosRepuestos(inicio, fin, this.textoBuscar).subscribe({
      next: (value) => {
        this.repuestosPorPagina = value.repuestos;
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
  obtenerRepuestosPorCategoriasDentroMarcasVehiculo(inicio: number, fin: number, categorias: string[]) {
    this._repuestoService.obtenerRepuestosPorCategoriasDentroMarcasVehiculo(inicio, fin, categorias).subscribe({
      next: (value) => {
        this.repuestosPorPagina = value;
      },
    })
  }
}
