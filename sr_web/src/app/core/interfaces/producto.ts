export interface Producto {
    id?: string;
    nombre_pro: string;
    vendedor_ced: string;
    descripcion: string;
    image: string;
    precio: number;
    estado: boolean;
    fecha_publicacion: Date;
}