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
