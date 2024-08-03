export interface Deposito {
    id?: string;
    cliente: string;
    contenedor_uid: string;
    tipo_reciclaje: string;
    peso: number;
    montoPagado: number;
    fecha: Date;
}