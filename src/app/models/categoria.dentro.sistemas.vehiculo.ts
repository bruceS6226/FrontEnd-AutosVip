export class CategoriaDentroSistemasVehiculo {
    constructor(
        public id_categoria_dentro_sistemas_vehiculo: number,
        public nombre_categoria_dentro_sistemas_vehiculo: string
    ) { }
}

export class RelacionSistemaVehiculo {
    constructor(
        public id_categoria_padre: number,
        public id_categoria_hijo: number,
    ) { }
}

export class CategoriaSistemasGraphNode {
    constructor(
        public id_categoria_dentro_sistemas_vehiculo: number,
        public nombre_categoria_dentro_sistemas_vehiculo: string,
        public children: CategoriaSistemasGraphNode[]
    ) { }
}