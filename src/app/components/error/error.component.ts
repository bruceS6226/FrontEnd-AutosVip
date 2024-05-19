import { Component } from '@angular/core';
import { RepuestoService } from 'src/app/services/repuestos.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  constructor(private _repuestoService: RepuestoService) { }
  crearDatos() {
    this._repuestoService.guardarDatosExcel().subscribe()
  }
}
