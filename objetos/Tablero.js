import * as THREE from '../libs/three.module.js'

class Tablero extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    const geometry = new THREE.BoxBufferGeometry(10,10,10);
    
    // Textura
    const loader = new THREE.TextureLoader();
    const textura = loader.load('../texturas/textura_cuadrada.png');
    textura.wrapS = THREE.RepeatWrapping;
    textura.wrapT = THREE.RepeatWrapping;
    textura.repeat.set(10,10);

    const mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({map: textura}) );
    this.add(mesh);

  }

  update() {
    
  }
}

export { Tablero };
