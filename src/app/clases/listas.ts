import { ListaItem } from './lista-item';


export class Lista{
    nombre:string;
    terminada:boolean;
    items:any[];
    

    constructor(nombre:string){
        this.nombre=nombre;
        this.terminada = false;
        this.items = [];
    }
}