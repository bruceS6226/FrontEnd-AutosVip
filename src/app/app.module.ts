import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { RepuestosComponent } from './components/repuestos/repuestos.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriasArbolComponent } from './components/categorias-arbol/categorias-arbol.component';
import { HttpClientModule } from '@angular/common/http';
import { DetalleRepuestoComponent } from './components/detalle-repuesto/detalle-repuesto.component';
import { CrearRepuestoComponent } from './components/crear-repuesto/crear-repuesto.component';

import {MatButtonModule} from '@angular/material/button';
import {MatTreeModule} from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { BuscarRepuestoComponent } from './components/buscar-repuesto/buscar-repuesto.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';
import { FooterComponent } from './components/footer/footer.component';
import { DetalleCarritoComponent } from './components/detalle-carrito/detalle-carrito.component';
import { ErrorComponent } from './components/error/error.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RepuestosComponent,
    HomeComponent,
    CategoriasArbolComponent,
    DetalleRepuestoComponent,
    BuscarRepuestoComponent,
    FooterComponent,
    DetalleCarritoComponent,
    ErrorComponent,
    CrearRepuestoComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTreeModule,
    MatExpansionModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCardModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
