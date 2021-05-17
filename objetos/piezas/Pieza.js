import * as THREE from '../../libs/three.module.js'

class Pieza extends THREE.Object3D {

  constructor(direccionBajada, segundos) {
    
    super();
 
    this.segundos = segundos;
    this.direccionBajada = direccionBajada;
    this.tiempo = new THREE.Clock();
    this.movimiento = true;
    
  }
  
  stop() {
    this.movimiento = false;
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
