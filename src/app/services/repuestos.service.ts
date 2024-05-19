import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Repuesto } from '../models/repuesto';
import { CategoriaDentroMarcasVehiculo, CategoriaMarcasGraphNode, RelacionMarcaVehiculo, RepuestoCategoriaDentroMarcasVehiculo } from '../models/categoria.dentro.marcas.vehiculo';
import { CategoriaDentroSistemasVehiculo, CategoriaSistemasGraphNode, RelacionSistemaVehiculo } from '../models/categoria.dentro.sistemas.vehiculo';
import { Servicio } from '../models/servicio';

@Injectable({
  providedIn: 'root'
})
export class RepuestoService {
  private appUrl = environment.appUrl;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }
  obtenerRepuestos(): Observable<Repuesto[]> {
    return this.http.get<Repuesto[]>(`${this.appUrl}${this.apiUrl}/repuestos`)
  }
  obtenerPocosRepuestos(inicio: number, fin: number): Observable<Repuesto[]> {
    return this.http.get<Repuesto[]>(`${this.appUrl}${this.apiUrl}/pocos-repuestos/${inicio}/${fin}`)
  }
  obtenerCantidadRepuestos(): Observable<number> {
    return this.http.get<number>(`${this.appUrl}${this.apiUrl}/cantidad-repuestos`)
  }
  obtenerNombresRepuestos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.appUrl}${this.apiUrl}/nombres-repuestos`)
  }
  obtenerRepuesto(id_repuesto: string): Observable<any> {
    return this.http.get<any>(`${this.appUrl}${this.apiUrl}/repuesto/${id_repuesto}`)
  }
  buscarRepuestos(textoBuscar: string): Observable<any> {
    return this.http.get<any>(`${this.appUrl}${this.apiUrl}/buscar/${textoBuscar}`)
  }
  buscarPocosRepuestos(inicio: number, fin: number, textoBuscar: string): Observable<any> {
    return this.http.get<any>(`${this.appUrl}${this.apiUrl}/buscar-pocos-repuestos/${inicio}/${fin}/${textoBuscar}`)
  }
  buscarCantidadRepuestos(textoBuscar: string): Observable<any> {
    return this.http.get<any>(`${this.appUrl}${this.apiUrl}/buscar-cantidad-repuestos/${textoBuscar}`)
  }
  buscarPocasFotosPrincipales(inicio: number, fin: number, textoBuscar: string): Observable<any> {
    return this.http.get<any>(`${this.appUrl}${this.apiUrl}/buscar-pocas-fotos-principales/${inicio}/${fin}/${textoBuscar}`)
  }

  obtenerFotoPrincipal(id_repuesto: string): Observable<string> {
    return this.http.get<string>(`${this.appUrl}${this.apiUrl}/foto-principal/${id_repuesto}`)
  }
  obtenerFotos(id_repuesto: string): Observable<any> {
    return this.http.get<any>(`${this.appUrl}${this.apiUrl}/fotos/${id_repuesto}`)
  }
  obtenerPocasFotosPrincipales(inicio: number, fin: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.appUrl}${this.apiUrl}/pocas-imagenes-principales/${inicio}/${fin}`)
  }

  obtenerCategoriasDentroMarcasVehiculos(): Observable<CategoriaDentroMarcasVehiculo[]> {
    return this.http.get<CategoriaDentroMarcasVehiculo[]>(`${this.appUrl}${this.apiUrl}/categorias_dentro_marcas_vehiculo`)
  }
  obtenerRelacionesMarcasVehiculos(): Observable<RelacionMarcaVehiculo[]> {
    return this.http.get<RelacionMarcaVehiculo[]>(`${this.appUrl}${this.apiUrl}/relaciones-marcas-vehiculo`)
  }
  obtenerRepuestosPorCategoriasDentroMarcasVehiculo(inicio: number, fin: number, categorias: string[]): Observable<Repuesto[]> {
    return this.http.post<Repuesto[]>(`${this.appUrl}${this.apiUrl}/repuestos-por-categoria-dentro-marcas-vehiculo/${inicio}/${fin}`, categorias)
  }
  obtenerFotosRepuestosPorCategoriasDentroMarcasVehiculo(inicio: number, fin: number, categorias: string[]): Observable<string[]> {
    return this.http.post<string[]>(`${this.appUrl}${this.apiUrl}/fotos-repuestos-por-categoria-dentro-marcas-vehiculo/${inicio}/${fin}`, categorias)
  }
  obtenerCantidadRepuestosPorCategoriasDentroMarcasVehiculo(categorias: string[]): Observable<number> {
    return this.http.post<number>(`${this.appUrl}${this.apiUrl}/cantidad-repuestos-por-categoria-dentro-marcas-vehiculo`, categorias)
  }
  obtenerRepuestosCategoriasDentroMarcasVehiculo(): Observable<RepuestoCategoriaDentroMarcasVehiculo[]> {
    return this.http.get<RepuestoCategoriaDentroMarcasVehiculo[]>(`${this.appUrl}${this.apiUrl}/repuestos-categorias-dentro-marcas-vehiculo`)
  }
  obtenerCategoriasDentroMarcasVehiculoPorRepuesto(id_repuesto: number): Observable<RepuestoCategoriaDentroMarcasVehiculo[]> {
    return this.http.get<RepuestoCategoriaDentroMarcasVehiculo[]>(`${this.appUrl}${this.apiUrl}/categorias-dentro-marcas-vehiculo-por-repuesto/${id_repuesto}`)
  }
  obtenerCategoriaDentroMarcasVehiculo(id_categoria: number): Observable<CategoriaDentroMarcasVehiculo> {
    return this.http.get<CategoriaDentroMarcasVehiculo>(`${this.appUrl}${this.apiUrl}/categoria_dentro_marcas_vehiculo/${id_categoria}`)
  }

  obtenerCategoriasDentroSistemasVehiculos(): Observable<CategoriaDentroSistemasVehiculo[]> {
    return this.http.get<CategoriaDentroSistemasVehiculo[]>(`${this.appUrl}${this.apiUrl}/categorias_dentro_sistemas_vehiculo`)
  }
  obtenerRelacionesSistemasVehiculos(): Observable<RelacionSistemaVehiculo[]> {
    return this.http.get<RelacionSistemaVehiculo[]>(`${this.appUrl}${this.apiUrl}/relaciones-sistemas-vehiculo`)
  }
  obtenerRepuestosPorCategoriasDentroSistemasVehiculo(inicio: number, fin: number, categorias: string[]): Observable<Repuesto[]> {
    return this.http.post<Repuesto[]>(`${this.appUrl}${this.apiUrl}/repuestos-por-categoria-dentro-sistemas-vehiculo/${inicio}/${fin}`, categorias)
  }

  organizarEnGrafoMarcas(categorias: CategoriaDentroMarcasVehiculo[], relaciones: RelacionMarcaVehiculo[]): CategoriaMarcasGraphNode[] {
    const categoriasMap = new Map<number, CategoriaMarcasGraphNode>();

    // Construir un mapa de categorías
    categorias.forEach(categoria => {
      categoriasMap.set(categoria.id_categoria_dentro_marcas_vehiculo, { ...categoria, children: [] });
    });

    // Construir el grafo
    relaciones.forEach(relacion => {
      const padre = categoriasMap.get(relacion.id_categoria_padre);
      const hijo = categoriasMap.get(relacion.id_categoria_hijo);
      if (padre && hijo) {
        // Aquí creamos una copia del nodo hijo para asignarlo al padre
        padre.children.push({ ...hijo });
      }
    });

    // Encontrar las categorías raíz
    const categoriasRaiz: CategoriaMarcasGraphNode[] = [];
    categorias.forEach(categoria => {
      if (!relaciones.some(relacion => relacion.id_categoria_hijo === categoria.id_categoria_dentro_marcas_vehiculo)) {
        categoriasRaiz.push(categoriasMap.get(categoria.id_categoria_dentro_marcas_vehiculo)!);
      }
    });

    return categoriasRaiz;
  }
  organizarEnGrafoSistemas(categorias: CategoriaDentroSistemasVehiculo[], relaciones: RelacionSistemaVehiculo[]): CategoriaSistemasGraphNode[] {
    const categoriasMap = new Map<number, CategoriaSistemasGraphNode>();

    // Construir un mapa de categorías
    categorias.forEach(categoria => {
      categoriasMap.set(categoria.id_categoria_dentro_sistemas_vehiculo, { ...categoria, children: [] });
    });

    // Construir el grafo
    relaciones.forEach(relacion => {
      const padre = categoriasMap.get(relacion.id_categoria_padre);
      const hijo = categoriasMap.get(relacion.id_categoria_hijo);
      if (padre && hijo) {
        // Aquí creamos una copia del nodo hijo para asignarlo al padre
        padre.children.push({ ...hijo });
      }
    });

    // Encontrar las categorías raíz
    const categoriasRaiz: CategoriaSistemasGraphNode[] = [];
    categorias.forEach(categoria => {
      if (!relaciones.some(relacion => relacion.id_categoria_hijo === categoria.id_categoria_dentro_sistemas_vehiculo)) {
        categoriasRaiz.push(categoriasMap.get(categoria.id_categoria_dentro_sistemas_vehiculo)!);
      }
    });

    return categoriasRaiz;
  }

  private actualizarSearchSubject = new Subject<void>();
  actualizarSearch$ = this.actualizarSearchSubject.asObservable();
  notificarActualizacionSearch(): void {
    this.actualizarSearchSubject.next();
  }

  private actualizarHeaderSubject = new Subject<void>();
  actualizarHeader$ = this.actualizarHeaderSubject.asObservable();
  notificarActualizacionHeader(): void {
    this.actualizarHeaderSubject.next();
  }

  private actualizarDetalleCarritoSubject = new Subject<void>();
  actualizarDetalleCarrito$ = this.actualizarDetalleCarritoSubject.asObservable();
  notificarDetalleCarrito(): void {
    this.actualizarDetalleCarritoSubject.next()
  }

  private actualizarRepuestosSubject = new Subject<void>();
  actualizarRepuestos$ = this.actualizarRepuestosSubject.asObservable();
  notificarRepuestos(): void {
    this.actualizarRepuestosSubject.next()
  }

  guardarDatosExcel(): Observable<any> {
    return this.http.patch<any>(`${this.appUrl}${this.apiUrl}/guardar-repuestos-excel`, null)
  }

  obtenerServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.appUrl}${this.apiUrl}/servicios`)
  }
  obtenerServicio(id_servicio: string): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.appUrl}${this.apiUrl}/servicio/${id_servicio}`)
  }
}
