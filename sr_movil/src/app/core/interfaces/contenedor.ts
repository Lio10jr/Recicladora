export interface Contenedor {
    id?: string;
    tipo_reciclaje: string;
    categorias: categorias[];
    capacidadMax: number;
    capacidadActual: number;
    estado: string;
    activo: boolean;
}

export interface categorias {
    nombre: string,
    precioKg: number;
}
