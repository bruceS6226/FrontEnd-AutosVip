import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RelacionMarcaVehiculo } from 'src/app/models/categoria.dentro.marcas.vehiculo';
import { Repuesto } from 'src/app/models/repuesto';
import { RepuestoService } from 'src/app/services/repuestos.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  constructor(private _repuestoService: RepuestoService, private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    const searchParam = window.location.search.split('?s=')[1];
    if (searchParam) {
      this.router.navigate(['/search'], { queryParams: { s: searchParam } });
    }
  }
}
