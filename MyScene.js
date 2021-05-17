
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { OrbitControls } from '../libs/OrbitControls.js';
import { getRandomInt } from './aux.js';

// Clases de mi proyecto
import { Tablero } from './objetos/Tablero.js'
import { Larga } from './objetos/piezas/Larga.js';
import { Cubo } from './objetos/piezas/Cubo.js';
import { L } from './objetos/piezas/L.js';
import { ZigZag } from './objetos/piezas/ZigZag.js';
import { T } from './objetos/piezas/T.js';

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();

    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI();
    this.createLights();
    this.createCamera();

    // Ejes para facilitar el desarrollo
    this.axis = new THREE.AxesHelper(30);
    this.add(this.axis);

    // ---------------------------------------------
    // Modelos creados para la escena
    // ---------------------------------------------
    this.tablero = new Tablero(this.gui, "Controles del tablero");
    this.add(this.tablero);

    // Vector de piezas
    this.piezaActual = -1;
    this.piezas = [];

    // Para tener en cuenta en que cara se encuentra el jugador
    // en todo momento
    // 0 -> Positiva en el eje Y (Superior)
    // 1 -> Negativa en el eje Y (Inferior)
    // 2 -> Positiva en el eje X (Derecha)
    // 3 -> Negativa en el eje X (Izquierda)
    // 4 -> Positiva en el eje Z (Delante)
    // 5 -> Negativa en el eje Z (Detrás)
    this.caraActual = 0;
    this.direccionVertical = new THREE.Vector3(0,0,1);
    this.direccionHorizontal = new THREE.Vector3(1,0,0);
    this.direccionBajada = new THREE.Vector3(0,-1,0);
    this.ejeRotacionDerecha = new THREE.Vector3(0,0,0);
    this.ejeRotacionAlante = new THREE.Vector3(0,0,0);

    // 1 -> Posición inicial
    // -1 -> Posición invertida
    this.direccionCamara = 1;

    
    // Para gestionar los niveles y las bajadas
    this.nivel = 1;
    this.segundosBajada = 7;
    
    this.generarPiezaAleatoria();
  
    // Cajas para derectar colisiones entre objetos (solo cuando siguen una estructura cuadrada)
    this.boxPieza = new THREE.Box3().setFromObject(this.piezas[this.piezaActual]);
    this.helperPieza = new THREE.Box3Helper(this.boxPieza, 0xff0000);
    this.add(this.helperPieza);

    this.boxTablero = new THREE.Box3().setFromObject(this.tablero);
    this.helperTablero = new THREE.Box3Helper(this.boxTablero, 0xff0000);
    this.add(this.helperTablero);

    console.log(this.boxPieza);
    console.log(this.boxTablero);

  }

  generarEje(){

    switch(this.caraActual){

      case 0: 
        this.direccionVertical = new THREE.Vector3(0,0,-1);
        this.direccionHorizontal = new THREE.Vector3(1,0,0);
        this.direccionBajada = new THREE.Vector3(0,-1,0);
        this.ejeRotacionDerecha = new THREE.Vector3(0,0,1);
        this.ejeRotacionAlante = new THREE.Vector3(-1,0,0);
        break;
      case 1: 
        this.direccionVertical = new THREE.Vector3(1,0,0);
        this.direccionHorizontal = new THREE.Vector3(0,0,-1);
        this.direccionBajada = new THREE.Vector3(0,1,0);
        this.ejeRotacionDerecha = new THREE.Vector3(-1,0,0);
        this.ejeRotacionAlante = new THREE.Vector3(0,0,1);
        break;
      case 2: 
        this.direccionVertical = new THREE.Vector3(0,1,0);
        this.direccionHorizontal = new THREE.Vector3(0,0,-1);
        this.direccionBajada = new THREE.Vector3(-1,0,0);
        this.ejeRotacionDerecha = new THREE.Vector3(0,-1,0);
        this.ejeRotacionAlante = new THREE.Vector3(0,0,1);
        break;
      case 3: 
        this.direccionVertical = new THREE.Vector3(0,1,0);
        this.direccionHorizontal = new THREE.Vector3(0,0,1);
        this.direccionBajada = new THREE.Vector3(1,0,0);
        this.ejeRotacionDerecha = new THREE.Vector3(0,-1,0);
        this.ejeRotacionAlante = new THREE.Vector3(0,0,-1);
        break;
      case 4: 
        this.direccionVertical = new THREE.Vector3(0,1,0);
        this.direccionHorizontal = new THREE.Vector3(1,0,0);
        this.direccionBajada = new THREE.Vector3(0,0,-1);
        this.ejeRotacionDerecha = new THREE.Vector3(0,-1,0);
        this.ejeRotacionAlante = new THREE.Vector3(-1,0,0);
        break;
      case 5:
        this.direccionVertical = new THREE.Vector3(0,1,0);
        this.direccionHorizontal = new THREE.Vector3(-1,0,0);
        this.direccionBajada = new THREE.Vector3(0,0,1);
        this.ejeRotacionDerecha = new THREE.Vector3(0,1,0);
        this.ejeRotacionAlante = new THREE.Vector3(1,0,0);
        break;

    }
    
  }

  generarPiezaAleatoria() {

    // const tipo = getRandomInt(5);
    const tipo = 2;
    let pieza = undefined;
    
    // this.caraActual = getRandomInt(6);
    this.caraActual = 0;
    this.generarEje();

    switch (tipo){
      case 0:
        pieza = new Cubo(this.direccionBajada, this.segundosBajada);
        break;
      case 1:
        pieza = new L(this.direccionBajada, this.segundosBajada);
        break;
      case 2:
        pieza = new Larga(this.direccionBajada, this.segundosBajada);
        break;
      case 3: 
        pieza = new T(this.direccionBajada, this.segundosBajada);
        break;
      case 4:
        pieza = new ZigZag(this.direccionBajada, this.segundosBajada);
        break;
    }

    this.piezaActual = this.piezas.length;
    this.piezas.push(pieza);
    this.add(this.piezas[this.piezaActual]);

    this.piezas[this.piezaActual].moverAPuntoDeInicio(this.caraActual);

  }

  colision () {

    this.piezas[this.piezaActual].stop();
    const posicion = this.piezas[this.piezaActual].position.clone();
    this.piezas[this.piezaActual].position.set( Math.round(posicion.x), Math.round(posicion.y), Math.round(posicion.z) )
    // this.generarPiezaAleatoria();

  }

  fueraTablero () {

    this.boxPieza.setFromObject(this.piezas[this.piezaActual]);
    console.log(this.caraActual);

    if(this.caraActual == 0 || this.caraActual == 1){
      this.fueraLimitesX();
      this.fueraLimitesZ();
    }
    else if(this.caraActual == 2 || this.caraActual == 3){
      this.fueraLimitesY();
      this.fueraLimitesZ();
    }
    else{
      this.fueraLimitesX();
      this.fueraLimitesY();
    }

  }

  fueraLimitesX(){

    if( this.boxPieza.max.x > 5 ){
      this.piezas[this.piezaActual].position.x -= (this.boxPieza.max.x - 5);
    }
    else if( this.boxPieza.min.x < -5 ){
      this.piezas[this.piezaActual].position.x += (-5 - this.boxPieza.min.x);
    }
    
  }

  fueraLimitesY(){

    if( this.boxPieza.max.y > 5 ){
      this.piezas[this.piezaActual].position.y -= (this.boxPieza.max.y - 5);
    }
    else if( this.boxPieza.min.y < -5 ){
      this.piezas[this.piezaActual].position.y += (-5 - this.boxPieza.min.y);
    }

  }

  fueraLimitesZ(){

    if( this.boxPieza.max.z > 5 ){
      this.piezas[this.piezaActual].position.z -= (this.boxPieza.max.z - 5);
    }
    else if( this.boxPieza.min.z < -5 ){
      this.piezas[this.piezaActual].position.z += (-5 - this.boxPieza.min.z);
    }
  }

  createCamera() {

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(30,30,30);
    // Hacia donde mira
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.up = new THREE.Vector3(0,1,0);
    this.camera.lookAt(look);
    this.add(this.camera);

    // Control de la cámara
    this.cameraControl = new OrbitControls(this.camera, this.renderer.domElement);
    this.cameraControl.zoomSpeed = 5;
    this.cameraControl.target = look;
  
  }

  createGUI() {
    
    var gui = new GUI();
    this.guiControls = new function () {
      // En el contexto de una función   this   alude a la función
      this.axisOnOff = true;
    }

    // Ejes
    var folder = gui.addFolder('Ejes');
    folder.add(this.guiControls, 'axisOnOff').name('Mostrar ejes : ');

    return gui;
  
  }

  createLights() {

    this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.pointLight = new THREE.PointLight(0xfcfcfc, 1, 50);
    // La añadimos a la escena
    this.add(this.ambientLight);
    this.add(this.pointLight);

  }

  createRenderer(myCanvas) {

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000), 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    $(myCanvas).append(renderer.domElement);

    return renderer;

  }

  getCamera() {
    return this.camera;
  }

  setCameraAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    
    this.setCameraAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  
  }

  update() {
    
    // Se muestran o no los ejes según lo que idique la GUI
    this.axis.visible = this.guiControls.axisOnOff;

    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render(this, this.getCamera());

    // Modifica la luz que sale de la pieza a la posición de la pieza
    this.pointLight.position.set(this.piezas[this.piezaActual].position.x, this.piezas[this.piezaActual].position.y, this.piezas[this.piezaActual].position.z);

    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();

    // --------------------------------------
    // ACTUALIZACIÓN DE MODELOS
    // --------------------------------------
    this.tablero.update();
    this.piezas[this.piezaActual].update();
    this.boxPieza.setFromObject(this.piezas[this.piezaActual]);

    if(this.boxPieza.intersectsBox(this.boxTablero))
      this.colision();

    // this.fueraTablero();

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }
}

$(function () {

  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener("resize", () => scene.onWindowResize());

  window.addEventListener("keyup", (event) => {
    console.log(event);
    switch (event.keyCode){
      case 65: 
        // A -> pieza hacia la izquierda
        scene.piezas[scene.piezaActual].position.x -= scene.direccionHorizontal.x*scene.direccionCamara;
        scene.piezas[scene.piezaActual].position.y -= scene.direccionHorizontal.y*scene.direccionCamara;
        scene.piezas[scene.piezaActual].position.z -= scene.direccionHorizontal.z*scene.direccionCamara;
        scene.fueraTablero();
        break;
      case 87:
        // W -> pieza hacia delante
        scene.piezas[scene.piezaActual].position.x += scene.direccionVertical.x*scene.direccionCamara;
        scene.piezas[scene.piezaActual].position.y += scene.direccionVertical.y*scene.direccionCamara;
        scene.piezas[scene.piezaActual].position.z += scene.direccionVertical.z*scene.direccionCamara;
        scene.fueraTablero();
        break;
      case 68:
        // D -> pieza hacia la derecha
        scene.piezas[scene.piezaActual].position.x += scene.direccionHorizontal.x*scene.direccionCamara;
        scene.piezas[scene.piezaActual].position.y += scene.direccionHorizontal.y*scene.direccionCamara;
        scene.piezas[scene.piezaActual].position.z += scene.direccionHorizontal.z*scene.direccionCamara;
        scene.fueraTablero();
        break;
      case 83:
        // S -> pieza hacia abajo
        scene.piezas[scene.piezaActual].position.x -= scene.direccionVertical.x*scene.direccionCamara;
        scene.piezas[scene.piezaActual].position.y -= scene.direccionVertical.y*scene.direccionCamara;
        scene.piezas[scene.piezaActual].position.z -= scene.direccionVertical.z*scene.direccionCamara;
        scene.fueraTablero();
        break;
      case 70:
        // F ->  Rotar hacia la derecha
        scene.piezas[scene.piezaActual].rotateOnWorldAxis(new THREE.Vector3(scene.ejeRotacionDerecha.x*scene.direccionCamara, scene.ejeRotacionDerecha.y*scene.direccionCamara, scene.ejeRotacionDerecha.z*scene.direccionCamara ), -Math.PI/2);
        scene.fueraTablero();
        break;
      case 82:
        // R -> Rotar hacia alante
        scene.piezas[scene.piezaActual].rotateOnWorldAxis(new THREE.Vector3(scene.ejeRotacionAlante.x*scene.direccionCamara, scene.ejeRotacionAlante.y*scene.direccionCamara, scene.ejeRotacionAlante.z*scene.direccionCamara ), Math.PI/2);
        scene.fueraTablero();
        break;
      case 67:
        // C -> Para cambiar la dirección de la cámara
        scene.camera.up = new THREE.Vector3(0,scene.camera.up.y*(-1),0);
        scene.cameraControl.rotateSpeed *= -1; // Para que gire en el sentido contrario
        scene.camera.position.y *= -1; // Para que la camara a pesar de girar siga mostrando aparentemente lo mismo
        scene.direccionCamara *= -1;
        scene.cameraControl.update();
        break;
    }

  })

  // Que no se nos olvide, la primera visualización.
  scene.update();
});
