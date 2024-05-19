import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaDentroMarcasVehiculo, RepuestoCategoriaDentroMarcasVehiculo } from 'src/app/models/categoria.dentro.marcas.vehiculo';
import { Repuesto } from 'src/app/models/repuesto';
import { RepuestoService } from 'src/app/services/repuestos.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-detalle-repuesto',
  templateUrl: './detalle-repuesto.component.html',
  styleUrls: ['./detalle-repuesto.component.css']
})
export class DetalleRepuestoComponent implements OnInit {

  public repuesto!: Repuesto;
  public id_repuesto: string = '';
  public appUrl = environment.appUrl;
  public apiUrl = environment.apiUrl;
  public fotoPrincipal: string = '';
  public fotos: string[] = [];
  public repuestosCategoriasDentroMarcasVehiculo: RepuestoCategoriaDentroMarcasVehiculo[] = [];
  public categoriaDentroMarcasVehiculo!: CategoriaDentroMarcasVehiculo;

  constructor(private _repuestoService: RepuestoService, private route: ActivatedRoute, private elementRef: ElementRef) {
    this.route.params.subscribe(params => this.id_repuesto = params['id_repuesto'])

  }

  ngOnInit(): void {
    this.obtenerRepuesto();
    this.efectoLupa()
  }

  obtenerRepuesto() {
    if (this.id_repuesto) {
      this._repuestoService.obtenerRepuesto(this.id_repuesto).subscribe({
        next: (value) => {
          this.repuesto = value;
          this.fotoPrincipal = value.foto_principal;
          this.obtenerFotos();
          this.obtenerCategoriasDentroMarcasVehiculoPorRepuesto(value.id_repuesto);
          console.log(value.id_repuesto)
        },
      })
    } else {
    }
  }

  obtenerCategoriasDentroMarcasVehiculoPorRepuesto(id_repuesto: number){
    this._repuestoService.obtenerCategoriasDentroMarcasVehiculoPorRepuesto(id_repuesto).subscribe({
      next: (value) =>{
        this.repuestosCategoriasDentroMarcasVehiculo = value;
        this.obtenerCategoriaDentroMarcasVehiculo(value[0].id_categoria_dentro_marcas_vehiculo);
        console.log(value[0].id_categoria_dentro_marcas_vehiculo)
      }
    })
  }

  obtenerCategoriaDentroMarcasVehiculo(id_categoria: number){
    this._repuestoService.obtenerCategoriaDentroMarcasVehiculo(id_categoria).subscribe({
      next: (value) =>{
        this.categoriaDentroMarcasVehiculo = value;
      }
    })
  }
  
  obtenerFotos() {
    if (this.id_repuesto) {
      this._repuestoService.obtenerFotos(this.id_repuesto).subscribe({
        next: (value) => {
          this.fotos = value.fotos.map((foto: { foto: string }) => foto.foto);
        },
      })
    } else {
    }
  }

  seleccionarFotoSecundaria(foto: string, posicion: number){
    this.fotos[posicion] = this.fotoPrincipal;
    this.fotoPrincipal = foto;
  }
  agregarAlCarrito(repuesto: Repuesto | null) {
    if (repuesto) {
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

  private efectoLupa(): void {
    this.elementRef.nativeElement.onmousemove = (e: MouseEvent) => {
      let x = e.clientX;
      let y = e.clientY;
      let x1, x2, y1, y2;
      let fact = 1.6;
      let opp = 100;

      y1 = -opp + (y) * fact - 50;
      x1 = -opp + (x) * fact - 350;
      y2 = +opp + (y) * fact + 50;
      x2 = +opp + (x) * fact - 50;

      const bigImage = this.elementRef.nativeElement.querySelector('.img2');
      bigImage.style.display = "inline";
      bigImage.style.left = ((x) * (1 - fact) + 50) + 'px';
      bigImage.style.top = ((y) * (1 - fact) + 50)+ 'px';
      bigImage.style.clip = `rect(${y1}px, ${x2}px, ${y2}px, ${x1}px)`;
    };
  }
  retornar(): void {
    window.history.back();
  }
}
