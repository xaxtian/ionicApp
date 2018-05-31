import { Component, OnInit } from '@angular/core';
import {Lista,ListaItem} from "../../app/clases/index";
import { AlertController,NavController } from 'ionic-angular';

import { ListaDeseosService } from '../../app/services/lista-deseos.service';


@Component({
    selector: 'agregar-name',
    templateUrl: './agregar.component.html'
})
export class AgregarComponent implements OnInit {
    nombreLista:string = "";
    nombreItem:string = "";

    items:ListaItem[]=[];

    constructor(
        public alertCtrl:AlertController,
        public listaDeseosService:ListaDeseosService,
        public navCtrl:NavController
    ) { }

    ngOnInit(): void { }

    agregar(){
        if(this.nombreItem.length==0){
            return;
        }

        let item = new ListaItem();
        item.nombre = this.nombreItem;

        this.items.push(item);
        this.nombreItem = "";

    }
    borrarItem(idx:number){
        this.items.splice(idx, 1);
    }
    guardarLista(){
        if(this.items.length==0 || this.nombreLista==""){
            this.showAlert();
            return;
        }
        let lista = new Lista(this.nombreLista);
        lista.items = this.items;

        this.listaDeseosService.agregarLista(lista);
        this.navCtrl.pop();
    }
    showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Nombre de la lista',
      subTitle: 'El nombre de la lista es necesario, tampoco puede estar vacía',
      buttons: ['OK']
    });
    alert.present();
  }
}
