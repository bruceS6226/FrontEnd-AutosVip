export class CategoriaDentroMarcasVehiculo {
    constructor(
        public id_categoria_dentro_marcas_vehiculo: number,
        public nombre_categoria_dentro_marcas_vehiculo: string
    ) { }
}

export class RelacionMarcaVehiculo {
    constructor(
        public id_categoria_padre: number,
        public id_categoria_hijo: number,
    ) { }
}

export class RepuestoCategoriaDentroMarcasVehiculo {
    constructor(
        public id_repuesto: string,
        public id_categoria_dentro_marcas_vehiculo: number,
    ) { }
}

export class CategoriaMarcasGraphNode {
    constructor(
        public id_categoria_dentro_marcas_vehiculo: number,
        public nombre_categoria_dentro_marcas_vehiculo: string,
        public children: CategoriaMarcasGraphNode[]
    ) { }
}