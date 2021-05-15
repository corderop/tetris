import * as THREE from '../../libs/three.module.js'

class Pieza extends THREE.Object3D {

  constructor(gui, titleGui) {
    
    super();

    this.createGUI(gui, titleGui);

  }

  createGUI(gui, titleGui){


  }

  update() {
    
  }
}

export { Pieza };
