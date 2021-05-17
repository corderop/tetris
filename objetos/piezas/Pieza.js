import * as THREE from '../../libs/three.module.js'

class Pieza extends THREE.Object3D {

  constructor(direccionBajada, segundos) {
    
    super();
 
    this.segundos = segundos;
    this.direccionBajada = direccionBajada;
    this.tiempo = new THREE.Clock();
    this.movimiento = true;
    this.rayos = [];

  }
  
  stop() {
    this.movimiento = false;
  }

  actualizarRayos () {

    this.actualizarBox();

    this.rayos = [];

    for( let i=0; i < this.box.length; i++){
      let posicion = new THREE.Vector3(
        this.box[i].min.x + (this.box[i].max.x-this.box[i].min.x)/2 ,
        this.box[i].min.y + (this.box[i].max.y-this.box[i].min.y)/2 ,
        this.box[i].min.z + (this.box[i].max.z-this.box[i].min.z)/2
      );
      this.rayos.push(new THREE.Raycaster(posicion, this.direccionBajada, 0, 30 ) );
    }
    
  }

  checkColision (objeto) {

    this.actualizarRayos();

    let colision = false;
  
    for( let i=0; i < this.rayos.length && !colision; i++){
      var salida = this.rayos[i].intersectObject(objeto, true);
      if(salida.length)
        colision = ( salida[0].distance < 0.5 );
    }

    return colision;

  }

  update() {

    if(this.movimiento){
      // No se comprueba el tiempo de finalización de la animación ya que la pieza parará al detectar una colisón
      const tiempoTranscurrido = this.tiempo.getDelta();
    
      this.position.x += this.direccionBajada.x * 20 * ( tiempoTranscurrido / this.segundos );
      this.position.y += this.direccionBajada.y * 20 * ( tiempoTranscurrido / this.segundos );
      this.position.z += this.direccionBajada.z * 20 * ( tiempoTranscurrido / this.segundos );
    }

  }
}

export { Pieza };
