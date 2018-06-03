import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GMaps } from '../../app/clases/gMaps';
import { MapService } from '../../app/services/trackService';
//import { ListaItem } from '../../app/clases/lista-item';




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  punto:any;
  gMaps:GMaps;
  error:any;

  constructor(
    public navCtrl: NavController,
    private mapService: MapService) {
};
ngOnInit(): void { 
  this.punto={};
      this.obtenerCoordenadas();}

  obtenerCoordenadas(){
    this.mapService.obtenerPosicion().then((resp) => {
      this.punto = resp;
      console.log('Latitud:'+ this.punto['latitud'] +"\nLongitud: "+this.punto['longitud']);
       this.pintar_punto();
        }).catch((error) => {
        console.log(error);
        });
}
pintar_punto(){
  this.mapService.initMap(document.getElementById('map'),this.punto)
  this.mapService.gMaps.pintar_salida();
  this.mapService.initTrack();
}
}
