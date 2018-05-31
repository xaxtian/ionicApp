import { Component, OnInit } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';
import { Lista,ListaItem } from '../../app/clases/index';
import {ListaDeseosService} from '../../app/services/lista-deseos.service'



@Component({
    selector: 'detalle-name',
    templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit {
    idx:number;
    lista:any;
    constructor(
        public navCtrl:NavController,
        public navParams:NavParams,
        public listaDeseosService:ListaDeseosService,
        public alertCtrl:AlertController
    ) { 
        this.idx = this.navParams.get("idx");
        this.lista = this.navParams.get("lista");
        console.log(this.navParams)
    }

    ngOnInit(): void { }

    actualizar(item:ListaItem){
        item.completado = !item.completado;
        let todosMarcados = true;
        for(let item of this.lista.items){
            if(!item.completado){
                todosMarcados = false;
                break;
            }
        }
        this.lista.terminada = todosMarcados;
        this.listaDeseosService.actualizarData();
    }

    borrarItem() {
    let confirm = this.alertCtrl.create({
      title: 'Estas seguro?',
      message: 'Esta acción borrará la lista definitivamente',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.listaDeseosService.borrarLista(this.idx);
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
    return confirm;
  }
}
