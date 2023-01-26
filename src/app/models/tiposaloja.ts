export class Tiposaloja{
    constructor(
        public id: number,
        public detalle: string,
        public estado: string,
        public titulo: string,
        public parrafo: string,
        public disponibles: number,
        public usuario: string,
        public fecha: string 
    ){

    }
}