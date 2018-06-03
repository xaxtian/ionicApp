declare var google;
export class GMaps{
		//Variables
		//Peticion al json con los datos de la carrera
        map:any;
        startPnt:any;
        endPnt:any;
        markers:any[];
        persona:any;
        imageKontrol:object = {
            url: '/assets/imgs/Map-Marker-Ball.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(48, 48),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(24, 48)
        };
        imageMeta:object ={
            url: '/assets/imgs/Map-Marker-Flag.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(48, 48),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(24, 48)
        };
        constructor(public element:any,public startPoint:any){
            console.log(startPoint)
            console.log(element)
            this.startPnt = startPoint;
            this.markers=[];
            this.persona={};
            this.map = new google.maps.Map(element, {
            zoom: 14,
            center: {lat: startPoint["latitud"], lng: startPoint["longitud"]},
            mapTypeId: 'satellite'
            });
    }

        pintar_recorrido(recorrido){
        	var coordenadas=[];
        	for(var i=0;i<recorrido.length;i++){
        	    coordenadas[i]=new google.maps.LatLng(recorrido[i]["latitud"],recorrido[i]["longitud"]);
                if(i==0)this.startPnt = recorrido[i];
                else if(i==(recorrido.length-1))this.endPnt = recorrido[i];
            }
            var flightPath = new google.maps.Polyline({
                path: coordenadas,
                strokeColor: "#0000FF",
                strokeOpacity: 0.8,
                strokeWeight: 2
                });
  		    flightPath.setMap(this.map);
        }

        pintar_kontrol(kontrol,texto){
        	this.markers.push(this._pintarMarker(kontrol,texto,this.map,this.imageKontrol));
        }
        pintar_kontroles(kontroles,textos = []){
        	for(var i = 0;i<kontroles.length;i++){
        		this.pintar_kontrol(kontroles[i],textos[i]);
        	}
        }
        pintar_salida(salida?,texto="Salida"){
            salida = typeof(salida)=="undefined"?this.startPnt:salida;
        	this.markers.push(this._pintarMarker(salida,texto,this.map,this.imageMeta));
        }
        pintar_meta(meta,texto){
            meta = typeof(meta)=="undefined"?this.endPnt:meta;
            texto = typeof(texto)=="undefined"?"Meta":texto;
        	this.markers.push(this._pintarMarker(meta,texto,this.map,this.imageMeta));
        }
        _pintarMarker(coord,info,map,_imageKontrol){
            let market=null;
            market = new google.maps.Marker({
                position: {lat: coord["latitud"], lng: coord["longitud"]},
                map: map,
                icon:_imageKontrol});
            var infowindow = new google.maps.InfoWindow({
                content: info
                });
            infowindow.open(map, market);
                market.addListener('click',function(event){
                infowindow.open(map, market);
            });
            return market;
        }
        _vaciarMarkers(){
            for(let i = 0; i<this.markers.length;i++){
                this.markers[i].setMap(null);
            }
                this.markers.length = 0;
        }
        _pintarPersona(punto?,texto="Salida"){
        	this.persona=this._pintarMarker(this.startPnt,texto,this.map,this.imageMeta);
        }
        _actualizarPersona(position){
            var latlng = new google.maps.LatLng(position["latitud"],position["longitud"]);
            this.persona.setPosition(latlng);
        }
        
}