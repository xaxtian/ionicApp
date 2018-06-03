import { Injectable } from '@angular/core';
import { Lista } from '../clases/listas';
import { ListaItem } from '../clases/lista-item';
import { Geolocation } from '@ionic-native/geolocation';
import { GMaps } from '../../app/clases/gMaps';


@Injectable()
export class MapService {
    activo:boolean;
    listas:Lista[]=[];
    nuevaLista:Lista;
    ultimoPunto:any;
    trackId:any;
    gMaps:GMaps;
    constructor(
        private geolocation: Geolocation
    ){
        this.cargarData();
        this.nuevaLista = new Lista("track");
    }
    //Gestion de datos de recorrido
    cargarData(){
        let data = JSON.parse(localStorage.getItem("data"));
        if(data != null){
            this.listas=JSON.parse(localStorage.getItem("data"));
        }
    }
    addPoint(_punto:any){
        //if(!this.mustSave(_punto))return;
        this.nuevaLista.items.push(_punto);
        this.ultimoPunto=_punto;

    }
    agregarLista(lista:Lista){
        this.listas.push(lista);
        this.actualizarData();
    }
    actualizarData(){
        localStorage.setItem("data",JSON.stringify(this.listas));
    }
    mustSave(_punto:any): boolean{
        if(this.ultimoPunto==null|| typeof(this.ultimoPunto)=='undefined' || this.distance(_punto,this.ultimoPunto)>20){
            console.log( "Distancia: "+this.distance(_punto,this.ultimoPunto)+"m")
            return true;
        }else{
            console.log( "Distancia: "+this.distance(_punto,this.ultimoPunto)+"m")
            return false;
        }
    }

    //Parte geolocation

    initTrack(){
      this.trackId = this.geolocation.watchPosition(); 
      let options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        };
        this.trackId.options=options;
      this.trackId.subscribe((data) => {
        let point={};
        point['latitud']=data.coords.latitude;
        point['longitud']=data.coords.longitude;
        this.addPoint(point);
        try{
            this.gMaps.pintar_recorrido(this.nuevaLista.items);
            this.gMaps._actualizarPersona(point);
        }catch(ex){
            console.log("Errores al añadir puntos")
        }
      });
    }
    finishTrack(){
        this.trackId.clearWatch();
        this.agregarLista(this.nuevaLista);
    }
    obtenerPosicion(){
    let promise = new Promise((resolve, reject) => {
    this.geolocation.getCurrentPosition().then((resp) => {
    var point={};
        console.log("Dentro")
        point['latitud']=resp.coords.latitude;
        point['longitud']=resp.coords.longitude;
        this.ultimoPunto = point;
        this.addPoint(point);
        resolve(point);
        }).catch((error) => {
        reject();
        });
      });
    return promise;
}
    //Parte google maps
    initMap(element:any,punto:any){
        this.gMaps = new GMaps(element,punto);
    }

    //Funciones de logica interna
    deg2rad(deg) {
      return deg * (Math.PI/180)
    }
    distance(_punto1:ListaItem,_punto2:ListaItem):number{
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(_punto2.latitud-_punto1.latitud);  // deg2rad below
        var dLon = this.deg2rad(_punto2.longitud-_punto1.longitud); 
        var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(_punto1.latitud)) * Math.cos(this.deg2rad(_punto2.latitud)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d/1000;
    }
}