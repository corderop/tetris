import * as THREE from '../../libs/three.module.js'
import { Pieza } from './Pieza.js';

class Cubo extends Pieza {
  constructor(gui, titleGui) {

    super(gui, titleGui);

    // Textura
    const loader = new THREE.TextureLoader();
    const textura = loader.load('../../texturas/textura_cuadrada.png');
    textura.wrapS = THREE.RepeatWrapping;
    textura.wrapT = THREE.RepeatWrapping;
    textura.repeat.set(2,2);
    const material = new THREE.MeshBasicMaterial({color: 0xFFFF00, map: textura});
  
    // Geometrías
    const geometryCubo = new THREE.BoxBufferGeometry(2,2,2);
    
    geometryCubo.translate(0, 1, 0);

    const mesh = new THREE.Mesh( geometryCubo, material );
    this.add(mesh);

  }

  update() {
    
  }
}

export { Cubo };
