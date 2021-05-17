import * as THREE from '../../libs/three.module.js'
import { Pieza } from './Pieza.js';

class Cubo extends Pieza {
  constructor(direccionBajada, segundos) {

    super(direccionBajada, segundos);
    
    // Textura
    const loader = new THREE.TextureLoader();
    const textura = loader.load('../../texturas/textura_cuadrada.png');
    textura.wrapS = THREE.RepeatWrapping;
    textura.wrapT = THREE.RepeatWrapping;
    textura.repeat.set(2,2);
    const material = new THREE.MeshBasicMaterial({color: 0xFFFF00, map: textura});
    
    // Geometrías
    const geometryCubo = new THREE.BoxBufferGeometry(2,2,2);
    
    const mesh = new THREE.Mesh( geometryCubo, material );
    this.add(mesh);
    
    this.box = new Array(1); 
    this.box[0] = new THREE.Box3().setFromObject(mesh);
    
  }

  actualizarBox () {

    this.box[0].setFromObject(this);

  }

  // Sobreescribe el método ya que este tiene una altura diferente
  checkColision (objeto) {

    this.actualizarRayos();

    let colision = false;
  
    for( let i=0; i < this.rayos.length && !colision; i++){
      var salida = this.rayos[i].intersectObject(objeto, true);
      if(salida.length)
        colision = ( salida[0].distance < 1 );
    }

    return colision;

  }

  moverAPuntoDeInicio(cara){

    switch(cara){
      case 0: 
        this.translateY(26);  
        break;
      case 1:
        this.translateY(-26);
        break;
      case 2: 
        this.translateX(26);
        break;
      case 3: 
        this.translateX(-26);
        break;
      case 4:
        this.translateZ(26);
        break;
      case 5:
        this.translateZ(-26);
        break;
    } 
 
  } 
  
}

export { Cubo };
