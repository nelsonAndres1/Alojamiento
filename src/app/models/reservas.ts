export class Reservas {
    constructor(
        public id: number,
        public fecha: string,
        public nombres: string,
        public apellidos:string,
        public correo: string,
        public pais: string,
        public telefono: string,
        public tiposaloja_id: string,
        public fecha_ini: string,
        public fecha_fin: string,
        public turno: string,
        public documento: string,
        public estado: string,
        public categoria: string
    ) { }
}