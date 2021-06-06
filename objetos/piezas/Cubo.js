import * as THREE from '../../libs/three.module.js'
import { Pieza } from './Pieza.js';

class Cubo extends Pieza {
  constructor(direccionBajada, segundos) {

    super(direccionBajada, segundos);
    
    // En un principio, el cubo estaba diseñado para ser un único cubo con repetición de texturas 
    // y no una unión de 8
    // Finalmente se hizo como una unión de 4 debido a que dificultaba la  

    // Textura
    const loader = new THREE.TextureLoader();
    const textura = loader.load('../../texturas/textura_cuadrada.png');
    const material = new THREE.MeshBasicMaterial({color: 0xFFFF00, map: textura});
    
    // Geometrías
    const geometryCubo1 = new THREE.BoxBufferGeometry(1,1,1);
    const geometryCubo2 = new THREE.BoxBufferGeometry(1,1,1);
    const geometryCubo3 = new THREE.BoxBufferGeometry(1,1,1);
    const geometryCubo4 = new THREE.BoxBufferGeometry(1,1,1);
    const geometryCubo5 = new THREE.BoxBufferGeometry(1,1,1);
    const geometryCubo6 = new THREE.BoxBufferGeometry(1,1,1);
    const geometryCubo7 = new THREE.BoxBufferGeometry(1,1,1);
    const geometryCubo8 = new THREE.BoxBufferGeometry(1,1,1);
    
    geometryCubo1.translate(-0.5, -0.5,  0.5);
    geometryCubo2.translate(-0.5, -0.5, -0.5);
    geometryCubo3.translate(-0.5,  0.5,  0.5);
    geometryCubo4.translate(-0.5,  0.5, -0.5);
    geometryCubo5.translate( 0.5, -0.5,  0.5);
    geometryCubo6.translate( 0.5, -0.5, -0.5);
    geometryCubo7.translate( 0.5,  0.5,  0.5);
    geometryCubo8.translate( 0.5,  0.5, -0.5);

    const mesh1 = new THREE.Mesh( geometryCubo1, material );
    this.add(mesh1);
    const mesh2 = new THREE.Mesh( geometryCubo2, material );
    this.add(mesh2);
    const mesh3 = new THREE.Mesh( geometryCubo3, material );
    this.add(mesh3);
    const mesh4 = new THREE.Mesh( geometryCubo4, material );
    this.add(mesh4);
    const mesh5 = new THREE.Mesh( geometryCubo5, material );
    this.add(mesh5);
    const mesh6 = new THREE.Mesh( geometryCubo6, material );
    this.add(mesh6);
    const mesh7 = new THREE.Mesh( geometryCubo7, material );
    this.add(mesh7);
    const mesh8 = new THREE.Mesh( geometryCubo8, material );
    this.add(mesh8);

    this.box = new Array(8); 
    this.box[0] = new THREE.Box3().setFromObject(mesh1);
    this.box[1] = new THREE.Box3().setFromObject(mesh2);
    this.box[2] = new THREE.Box3().setFromObject(mesh3);
    this.box[3] = new THREE.Box3().setFromObject(mesh4);
    this.box[4] = new THREE.Box3().setFromObject(mesh5);
    this.box[5] = new THREE.Box3().setFromObject(mesh6);
    this.box[6] = new THREE.Box3().setFromObject(mesh7);
    this.box[7] = new THREE.Box3().setFromObject(mesh8);

  }

  actualizarBox () {

    this.box[0].setFromObject(this.children[0]);
    this.box[1].setFromObject(this.children[1]);
    this.box[2].setFromObject(this.children[2]);
    this.box[3].setFromObject(this.children[3]);
    this.box[4].setFromObject(this.children[4]);
    this.box[5].setFromObject(this.children[5]);
    this.box[6].setFromObject(this.children[6]);
    this.box[7].setFromObject(this.children[7]);

  }

  // actualizarRayos() {

  //   superiorDerecha = {
  //     min: this.box[0].min
  //   }

  //   let posicion = new THREE.Vector3(
  //     this.box[0].min.x + (this.box[0].max.x-this.box[0].min.x)/2 ,
  //     this.box[0].min.y + (this.box[0].max.y-this.box[0].min.y)/2 ,
  //     this.box[0].min.z + (this.box[0].max.z-this.box[0].min.z)/2
  //   );
  //   this.rayos.push(new THREE.Raycaster(posicion, this.direccionBajada, 0, 30 ) );

  // }

  // // Sobreescribe el método ya que este tiene una altura diferente
  // checkColision (objeto) {

  //   this.actualizarRayos();

  //   let colision = false;
  
  //   for( let i=0; i < this.rayos.length && !colision; i++){
  //     var salida = this.rayos[i].intersectObject(objeto, true);
  //     if(salida.length){
  //       colision = ( salida[0].distance < this.lastDistance );

  //       if(colision)
  //         this.distanciaParado = salida[0].distance-1;

  //     }
  //   }

  //   return colision;

  // }

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
