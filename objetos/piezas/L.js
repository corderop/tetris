import * as THREE from '../../libs/three.module.js'
import { Pieza } from './Pieza.js';

class L extends Pieza {
  constructor() {
    super();

    // Textura
    const loader = new THREE.TextureLoader();
    const textura = loader.load('../../texturas/textura_cuadrada.png');
    const material = new THREE.MeshBasicMaterial({color: 0xFF6600, map: textura});

    // Geometrías
    const geometryCubo1 = new THREE.BoxBufferGeometry(1,1,1);
    const geometryCubo2 = new THREE.BoxBufferGeometry(1,1,1);
    const geometryCubo3 = new THREE.BoxBufferGeometry(1,1,1);
    const geometryCubo4 = new THREE.BoxBufferGeometry(1,1,1);
    
    geometryCubo1.translate(-0.5, -0.5, 0.5);
    geometryCubo2.translate(-0.5,  0.5, 0.5);
    geometryCubo3.translate(-0.5,  1.5, 0.5);
    geometryCubo4.translate( 0.5, -0.5, 0.5);

    const mesh1 = new THREE.Mesh( geometryCubo1, material );
    this.add(mesh1);
    const mesh2 = new THREE.Mesh( geometryCubo2, material );
    this.add(mesh2);
    const mesh3 = new THREE.Mesh( geometryCubo3, material );
    this.add(mesh3);
    const mesh4 = new THREE.Mesh( geometryCubo4, material );
    this.add(mesh4);

  }

  moverAPuntoDeInicio(cara){

    switch(cara){
      case 0:
        this.translateY(26);  
        break;
      case 1:
        this.translateY(-26);
        this.rotateX(Math.PI);
        break;
      case 2: 
        this.translateX(26);
        this.rotateZ(-Math.PI/2)
        break;
      case 3: 
        this.translateX(-26);
        this.rotateZ(Math.PI/2)
        break;
      case 4:
        this.translateZ(26);
        this.rotateX(Math.PI/2);
        break;  
      case 5:
        this.translateZ(-26);
        this.rotateX(-Math.PI/2);
        break;
    } 
 
  } 

  update() {
    
  }
}

export { L };
