export interface Usuario {
    cedula: string;
    nombre: string;
    apellido: string;
    saldo: number;
    rol: string;
    token_noti?: string;
}
