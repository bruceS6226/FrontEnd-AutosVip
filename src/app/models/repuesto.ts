export class Repuesto {
    constructor(
        public id_repuesto: string,
        public nombre_repuesto: string,
        public marca_repuesto: string,
        public sistema_vehiculo: string,
        public costo_ultima_compra: number,
        public costo_promedio: number,
        public costo_lifo: number,
        public costo_fifo: number,
        public ultimo_costo_venta: number,
        public ultimo_precio_venta: number,
        public cantidad_inventario: number,
        public dias_de_stock: number,
        public rotacion_de_producto: number,
        public cantidad_minima: number,
        public cantidad_maxima: number,
        public mad: number,
        public pedido_de_reposicion: number,
        public lead_time_de_pedido: number,
        public lead_time_de_entrega: number,
        public lead_time_de_ancionalizaicon: number,
        public clasificacion_seane: string,
        public valor_seae: number,
        public advalorem: number,
        public iva: number,
        public seguro_internacional: number,
        public seguro_nacional: number,
        public fondinfa: number,
        public almacenera: number,
        public costo_proveedor_exterior: number,
        public costo_puerto_de_origen: number,
        public precio_PVP: number,
        public medida_1: number,
        public medida_2: number,
        public medida_3: number,
        public foto_principal: string,
    ) { }
}