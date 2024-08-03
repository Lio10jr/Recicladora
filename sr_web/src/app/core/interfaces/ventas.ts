export interface Venta {
    id?: string;
    producto_uid: string;
    vendedor_ced: string;
    comprador_ced: string;
    precio_pro: number;
    comision: number;
    monto_total: number;
    fecha: Date;
}