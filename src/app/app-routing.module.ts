import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetalleRepuestoComponent } from './components/detalle-repuesto/detalle-repuesto.component';
import { RepuestosComponent } from './components/repuestos/repuestos.component';
import { BuscarRepuestoComponent } from './components/buscar-repuesto/buscar-repuesto.component';
import { BuscarGuard } from './utils/buscar.guard';
import { DetalleCarritoComponent } from './components/detalle-carrito/detalle-carrito.component';
import { ErrorComponent } from './components/error/error.component';
import { CrearRepuestoComponent } from './components/crear-repuesto/crear-repuesto.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [BuscarGuard] },
  { path: 'search', component: BuscarRepuestoComponent },
  { path: 'repuesto/:id_repuesto', component: DetalleRepuestoComponent },
  //{ path: 'detalle-carrito', component: DetalleCarritoComponent},
  { path: 'soysecreto987654321', component: ErrorComponent},
  { path: 'repuestos', component: RepuestosComponent, children: [
    { path: '**', component: RepuestosComponent }
  ]},
  { path: 'crear-repuesto', component: CrearRepuestoComponent },
  { path: '**', component: HomeComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
