import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Repuesto } from 'src/app/models/repuesto';
import { RepuestoService } from 'src/app/services/repuestos.service';
import { environment } from 'src/environment/environment';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CategoriaDentroMarcasVehiculo, CategoriaMarcasGraphNode, RelacionMarcaVehiculo } from 'src/app/models/categoria.dentro.marcas.vehiculo';
import { CategoriaDentroSistemasVehiculo, CategoriaSistemasGraphNode, RelacionSistemaVehiculo } from 'src/app/models/categoria.dentro.sistemas.vehiculo';
import { Servicio } from 'src/app/models/servicio';

interface CategoriaMarcasFlatNode {
  expandable: boolean;
  nombre_categoria_dentro_marcas_vehiculo: string;
  level: number;
  categoria_dentro_marcas_vehiculo?: CategoriaMarcasFlatNode[];
}
interface CategoriaSistemasFlatNode {
  expandable: boolean;
  nombre_categoria_dentro_sistemas_vehiculo: string;
  level: number;
  categoria_dentro_sistemas_vehiculo?: CategoriaSistemasFlatNode[];
}
interface ServicioNode {
  nombre_servicio: string;
  servicio?: ServicioNode[];
}
interface ServicioFlatNode {
  expandable: boolean,
  nombre_servicio: string,
  level: number,
}

@Component({
  selector: 'app-categorias-arbol',
  templateUrl: './categorias-arbol.component.html',
  styleUrls: ['./categorias-arbol.component.css']
})
export class CategoriasArbolComponent implements OnInit {

  public appUrl = environment.appUrl;
  public apiUrl = environment.apiUrl;
  public repuestos: Repuesto[] = [];
  public repuestosFitradosMarca: Repuesto[] = [];
  public repuestosFitradosNombre: Repuesto[] = [];
  public repuestosSeleccionadosParaCompra: Repuesto[] = []

  marcasTreeControl: FlatTreeControl<CategoriaMarcasFlatNode>;
  sistemasTreeControl: FlatTreeControl<CategoriaSistemasFlatNode>;
  serviciosTreeControl: FlatTreeControl<ServicioFlatNode>;

  marcasTreeFlattener: MatTreeFlattener<CategoriaMarcasGraphNode, CategoriaMarcasFlatNode>;
  sistemasTreeFlattener: MatTreeFlattener<CategoriaSistemasGraphNode, CategoriaSistemasFlatNode>;
  servicioTreeFlattener: MatTreeFlattener<ServicioNode, ServicioFlatNode>

  dataSourceMarcas: MatTreeFlatDataSource<CategoriaDentroMarcasVehiculo, CategoriaMarcasFlatNode>;
  dataSourceSistemas: MatTreeFlatDataSource<CategoriaDentroSistemasVehiculo, CategoriaSistemasFlatNode>;
  dataSourceServicios: MatTreeFlatDataSource<ServicioNode, ServicioFlatNode>

  public relacionesMarcaVehiculo: RelacionMarcaVehiculo[] = [];
  public relacionesSistemaVehiculo: RelacionSistemaVehiculo[] = [];
  public categorias: string[] = [];
  private expandedNodes: Set<string> = new Set<string>();
  public ramaClicada: string = '';

  public servicios: Servicio[] = [];

  constructor(private _repuestoService: RepuestoService, private route: ActivatedRoute,
    private router: Router) {
    this.marcasTreeFlattener = new MatTreeFlattener(
      this.marcasTransformer.bind(this),
      node => node.level,
      node => node.expandable,
      node => node.children
    );
    this.sistemasTreeFlattener = new MatTreeFlattener(
      this.sistemasTransformer.bind(this),
      node => node.level,
      node => node.expandable,
      node => node.children
    );
    this.servicioTreeFlattener = new MatTreeFlattener(
      this.servicioTransformer.bind(this),
      node => node.level,
      node => node.expandable,
      node => node.servicio
    );
    this.marcasTreeControl = new FlatTreeControl<CategoriaMarcasFlatNode>(
      node => node.level,
      node => node.expandable
    );
    this.sistemasTreeControl = new FlatTreeControl<CategoriaSistemasFlatNode>(
      node => node.level,
      node => node.expandable
    );
    this.serviciosTreeControl = new FlatTreeControl<ServicioFlatNode>(
      node => node.level,
      node => node.expandable
    );
    this.dataSourceMarcas = new MatTreeFlatDataSource(this.marcasTreeControl, this.marcasTreeFlattener);
    this.dataSourceSistemas = new MatTreeFlatDataSource(this.sistemasTreeControl, this.sistemasTreeFlattener);
    this.dataSourceServicios = new MatTreeFlatDataSource(this.serviciosTreeControl, this.servicioTreeFlattener);

  }
  ngOnInit(): void {
    this.route.url.subscribe(segments => {
      const urlSegments = segments.map(segment => segment.path);
      if (urlSegments[0] === 'repuestos') {
        this.ramaClicada = 'repuestos'
      }
      if (urlSegments[0] === 'search') {
        this.ramaClicada = 'search'
      }
      this.route.firstChild?.url.subscribe(segments => {
        if (segments.length > 0) {
          const params = segments.map(segment => segment.path);
          this.ramaClicada = params[params.length - 1];
        }
      });
    });
    this.obtenerRelacionesMarcasVehiculos();
    this.obtenerRelacionesSistemasVehiculos();
    this.obtenerServicios()
  }
  obtenerRelacionesMarcasVehiculos() {
    this._repuestoService.obtenerRelacionesMarcasVehiculos().subscribe({
      next: (value) => {
        this.relacionesMarcaVehiculo = value;
        this.obtenerCategorias();
      },
    })
  }
  obtenerRelacionesSistemasVehiculos() {
    this._repuestoService.obtenerRelacionesSistemasVehiculos().subscribe({
      next: (value) => {
        this.relacionesSistemaVehiculo = value;
        this.obtenerCategorias();
      },
    })
  }

  obtenerCategorias() {
    this._repuestoService.obtenerCategoriasDentroMarcasVehiculos().subscribe({
      next: (value) => {
        const categoriasMarcas = this._repuestoService.organizarEnGrafoMarcas(value, this.relacionesMarcaVehiculo);
        this.dataSourceMarcas.data = categoriasMarcas;
        this.restoreMarcasExpandedNodesState();
      },
    })
    this._repuestoService.obtenerCategoriasDentroSistemasVehiculos().subscribe({
      next: (value) => {
        const categoriasSistemas = this._repuestoService.organizarEnGrafoSistemas(value, this.relacionesSistemaVehiculo);
        this.dataSourceSistemas.data = categoriasSistemas;
        this.restoreSistemasExpandedNodesState();
      },
    })
  }
  private restoreMarcasExpandedNodesState() {
    this.marcasTreeControl.dataNodes.forEach(node => {
      if (this.expandedNodes.has(node.nombre_categoria_dentro_marcas_vehiculo)) {
        this.marcasTreeControl.expand(node);
      }
    });
  }
  private restoreSistemasExpandedNodesState() {
    this.sistemasTreeControl.dataNodes.forEach(node => {
      if (this.expandedNodes.has(node.nombre_categoria_dentro_sistemas_vehiculo)) {
        this.sistemasTreeControl.expand(node);
      }
    });
  }
  expandNodeMarcas(node: any) {
    this.marcasTreeControl.expand(node);
  }
  collapseNodeMarcas(node: any) {
    this.marcasTreeControl.collapse(node);
  }
  expandNodeSistemas(node: any) {
    this.sistemasTreeControl.expand(node);
  }
  collapseNodeSistemas(node: any) {
    this.sistemasTreeControl.collapse(node);
  }
  marcasHasChild = (_: number, node: CategoriaMarcasFlatNode) => node.expandable;
  marcasTransformer(node: CategoriaMarcasGraphNode, level: number): CategoriaMarcasFlatNode {
    return {
      expandable: node.children && node.children.length > 0,
      nombre_categoria_dentro_marcas_vehiculo: node.nombre_categoria_dentro_marcas_vehiculo,
      level: level,
      categoria_dentro_marcas_vehiculo: node.children.map(child => this.marcasTransformer(child, level + 1))
    };
  }
  sistemasHasChild = (_: number, node: CategoriaSistemasFlatNode) => node.expandable;
  sistemasTransformer(node: CategoriaSistemasGraphNode, level: number): CategoriaSistemasFlatNode {
    return {
      expandable: node.children && node.children.length > 0,
      nombre_categoria_dentro_sistemas_vehiculo: node.nombre_categoria_dentro_sistemas_vehiculo,
      level: level,
      categoria_dentro_sistemas_vehiculo: node.children.map(child => this.sistemasTransformer(child, level + 1))
    };
  }
  marcarDelArbol(nombreRama: string) {
    this._repuestoService.notificarRepuestos()
    this.ramaClicada = nombreRama;
  }
  buscarRepuestoPorCategoriaDentroMarcasVehiculo(node: CategoriaMarcasFlatNode) {
    const generatePathSegments = (currentNode: CategoriaMarcasFlatNode): string[] => {
      const pathSegments: string[] = [];
      const auxF = (nodeIndex: number, nodeLevel: number): void => {
        let currentIndex = nodeIndex - 1;
        while (currentIndex >= 0) {
          const parentNode = this.marcasTreeControl.dataNodes[currentIndex];
          const parentLevel = this.marcasTreeControl.getLevel(parentNode);
          if (parentLevel < nodeLevel) {
            pathSegments.unshift(parentNode.nombre_categoria_dentro_marcas_vehiculo);
            auxF(currentIndex, parentLevel);
            break;
          }
          currentIndex--;
        }
      };
      const getParentCategories = (node: CategoriaMarcasFlatNode): void => {
        if (node) {
          const currentNodeIndex = this.marcasTreeControl.dataNodes.findIndex(item => item === node);
          const nodeLevel = this.marcasTreeControl.getLevel(node);
          if (nodeLevel > 0) {
            auxF(currentNodeIndex, nodeLevel);
          }
        }
      };
      getParentCategories(currentNode);
      return pathSegments;
    };
    const pathSegments = generatePathSegments(node);
    var link;
    if (pathSegments.length > 0) {
      link = '/repuestos/' + pathSegments.join('/') + '/' + node.nombre_categoria_dentro_marcas_vehiculo;
    } else {
      link = '/repuestos/' + node.nombre_categoria_dentro_marcas_vehiculo;
    }
    return link;
    //window.location.href = link;
  }
  buscarRepuestoPorCategoriaDentroSistemasVehiculo(node: CategoriaSistemasFlatNode) {
    const generatePathSegments = (currentNode: CategoriaSistemasFlatNode): string[] => {
      const pathSegments: string[] = [];
      const auxF = (nodeIndex: number, nodeLevel: number): void => {
        let currentIndex = nodeIndex - 1;
        while (currentIndex >= 0) {
          const parentNode = this.sistemasTreeControl.dataNodes[currentIndex];
          const parentLevel = this.sistemasTreeControl.getLevel(parentNode);
          if (parentLevel < nodeLevel) {
            pathSegments.unshift(parentNode.nombre_categoria_dentro_sistemas_vehiculo);
            auxF(currentIndex, parentLevel);
            break;
          }
          currentIndex--;
        }
      };
      const getParentCategories = (node: CategoriaSistemasFlatNode): void => {
        if (node) {
          const currentNodeIndex = this.sistemasTreeControl.dataNodes.findIndex(item => item === node);
          const nodeLevel = this.sistemasTreeControl.getLevel(node);
          if (nodeLevel > 0) {
            auxF(currentNodeIndex, nodeLevel);
          }
        }
      };
      getParentCategories(currentNode);
      return pathSegments;
    };
    const pathSegments = generatePathSegments(node);
    var link;
    if (pathSegments.length > 0) {
      link = '/repuestos/' + pathSegments.join('/') + '/' + node.nombre_categoria_dentro_sistemas_vehiculo;
    } else {
      link = '/repuestos/' + node.nombre_categoria_dentro_sistemas_vehiculo;
    }
    this.router.navigateByUrl(link)
    //window.location.href = link;
  }

  serviciosHasChild = (_: number, node: ServicioFlatNode) => node.expandable;
  servicioTransformer(node: ServicioNode, level: number): ServicioFlatNode {
    return {
      expandable: !!node.servicio && node.servicio.length > 0,
      nombre_servicio: node.nombre_servicio,
      level: level,
    };
  }

  organizarServiciosEnArbol(servicios: Servicio[]): ServicioNode[] {
    var listaNombresServicios: ServicioNode[] = [];
    var servicioNode: ServicioNode[];
    servicios.forEach(servicio => {
      listaNombresServicios.push({
        nombre_servicio: servicio.nombre_servicio
      });
    });
    servicioNode = [{
      nombre_servicio: 'Servicios',
      servicio: listaNombresServicios
    }];
    return servicioNode;
  }
  obtenerServicios() {
    this._repuestoService.obtenerServicios().subscribe({
      next: (value) => {
        const servicioNode = this.organizarServiciosEnArbol(value);
        this.dataSourceServicios.data = servicioNode;
      },
    })
  }
}
