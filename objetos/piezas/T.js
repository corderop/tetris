import * as THREE from '../../libs/three.module.js'
import { Pieza } from './Pieza.js';

class T extends Pieza {
  constructor(gui, titleGui) {
    super(gui, titleGui);

    // Textura
    const loader = new THREE.TextureLoader();
    const textura = loader.load('../../texturas/textura_cuadrada.png');
    const material = new THREE.MeshBasicMaterial({color: 0xFF00FF, map: textura});

    // Geometrías
    const geometryCubo1 = new THREE.BoxBufferGeometry(1,1,1);
    const geometryCubo2 = new THREE.BoxBufferGeometry(1,1,1);
    const geometryCubo3 = new THREE.BoxBufferGeometry(1,1,1);
    const geometryCubo4 = new THREE.BoxBufferGeometry(1,1,1);
    
    geometryCubo1.translate( 0, 0.5, 0);
    geometryCubo2.translate( 0, 1.5, 0);
    geometryCubo3.translate(-1, 1.5, 0);
    geometryCubo4.translate( 1, 1.5, 0);

    const mesh1 = new THREE.Mesh( geometryCubo1, material );
    this.add(mesh1);
    const mesh2 = new THREE.Mesh( geometryCubo2, material );
    this.add(mesh2);
    const mesh3 = new THREE.Mesh( geometryCubo3, material );
    this.add(mesh3);
    const mesh4 = new THREE.Mesh( geometryCubo4, material );
    this.add(mesh4);

  }

  update() {
    
  }
}

export { T };
