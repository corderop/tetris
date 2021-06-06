
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// EL MÓDULO ORBIT CONTROLS NO ESTABA INCLUIDO EN LAS LIBRERÍAS DE PRADO
// SIN EL, LOS CONTROLES DE LA CÁMARA NO FUNCIONARÁN Y EL PROYECTO POSIBLEMENTE NO CARGARÁ
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
    this.axis.visible = false;

    // ---------------------------------------------
    // Modelos creados para la escena
    // ---------------------------------------------
    this.tablero = new Tablero(this.gui, "Controles del tablero");
    this.add(this.tablero);

    // Vector de piezas
    this.piezaActual = undefined;

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
    this.puntuacion = 0;
    this.segundosBajada = 1;
    
    this.generarPiezaAleatoria(false);
  
    // Cajas para derectar colisiones entre objetos (solo cuando siguen una estructura cuadrada)
    this.boxPieza = new THREE.Box3().setFromObject(this.piezaActual);
    this.helperPieza = new THREE.Box3Helper(this.boxPieza, 0xff0000);
    this.add(this.helperPieza);
    this.helperPieza.visible = false;

    this.boxTablero = new THREE.Box3().setFromObject(this.tablero);
    this.helperTablero = new THREE.Box3Helper(this.boxTablero, 0xff0000);
    this.add(this.helperTablero);
    this.helperTablero.visible = false;

    // Bloques en el tablero
    this.bloquesTablero = new Array(6).fill(new THREE.Object3D());
    this.add(this.bloquesTablero[0]);
    this.add(this.bloquesTablero[1]);
    this.add(this.bloquesTablero[2]);
    this.add(this.bloquesTablero[3]);
    this.add(this.bloquesTablero[4]);
    this.add(this.bloquesTablero[5]);

    // Variable para iniciar al pulsar hacia delante
    this.jugando = false;
    this.crearPantallas();

    // Variable para gestionar los cambios de piezas
    // Solo se podrá hacer un cambio de pieza hasta que no se coloque una
    this.cambioPieza = true;

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

  generarPiezaAleatoria(cambiarPieza) {

    if(cambiarPieza){
      this.cambioPieza = false;
    }
    else{
      this.cambioPieza = true;
      this.puntuacion++;
      if(this.puntuacion%10 == 0)
        this.siguienteNivel();
    }

    const tipo = getRandomInt(5);
    let pieza = undefined;
    
    if(!cambiarPieza){
      this.caraActual = getRandomInt(6);
      this.generarEje();
    }
    else{
      this.remove(this.piezaActual);
    }

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


    this.piezaActual = pieza;
    this.add(this.piezaActual);

    this.piezaActual.moverAPuntoDeInicio(this.caraActual);

  }

  colision () {

    this.piezaActual.stop();
        
    this.bloquesTablero[this.caraActual].attach(this.piezaActual);
    this.remove(this.piezaActual);
    
    var box = new THREE.Box3().setFromObject(this.bloquesTablero[this.caraActual]);

    if(!this.checkGameOver(box)){
      this.generarPiezaAleatoria(false);
    }
    else{
      console.log('Game Over');
      this.jugando = false;
      this.gameOver();
    }

  }

  crearPantallas() {

    var geo1 = new THREE.PlaneGeometry(20, 11.22);
    var geo2 = new THREE.PlaneGeometry(20, 11.22);
    var geo3 = new THREE.PlaneGeometry(20, 11.22);
    var geo4 = new THREE.PlaneGeometry(20, 11.22);
    var geo5 = new THREE.PlaneGeometry(20, 11.22);
    var geo6 = new THREE.PlaneGeometry(20, 11.22);

    const material = new THREE.MeshBasicMaterial({ color: 0x000000 })

    this.pantallas = new THREE.Object3D();

    geo1.translate(0, 0, -50);

    geo2.rotateY(Math.PI);
    geo2.translate(0, 0, 50);

    geo3.rotateY(-Math.PI/2);
    geo3.translate(50, 0, 0);

    geo4.rotateY(Math.PI/2);
    geo4.translate(-50, 0, 0);

    geo5.rotateX(-Math.PI/2);
    geo5.translate(0, -50, 0);

    geo6.rotateX(Math.PI/2);
    geo6.translate(0, 50, 0);

    var m1 = new THREE.Mesh(geo1, material);
    var m2 = new THREE.Mesh(geo2, material);
    var m3 = new THREE.Mesh(geo3, material);
    var m4 = new THREE.Mesh(geo4, material);
    var m5 = new THREE.Mesh(geo5, material);
    var m6 = new THREE.Mesh(geo6, material);

    this.pantallas.add(m1);
    this.pantallas.add(m2);
    this.pantallas.add(m3);
    this.pantallas.add(m4);
    this.pantallas.add(m5);
    this.pantallas.add(m6);

    this.add(this.pantallas);
    this.pantallas.visible = false;

  }

  siguienteNivel() {

    this.nivel++;
    this.segundosBajada *= 0.9;

    const loader = new THREE.TextureLoader();
    const textura = loader.load('texturas/next_level.jpg');
    const material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, map: textura});

    this.pantallas.traverse( ( obj ) => {
      obj.material = material;
    })

    this.pantallas.visible = true;

    setTimeout( () => {
      this.pantallas.visible = false;
    }, 2000);

  }

  gameOver(){

    const loader = new THREE.TextureLoader();
    const textura = loader.load('texturas/gameover.jpg');
    const material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, map: textura});

    this.pantallas.traverse( ( obj ) => {
      obj.material = material;
    })

    this.pantallas.visible = true;

  }

  checkGameOver(box){

    switch(this.caraActual){

      case 0: 
        return ( box.max.y > 20 );
      case 1: 
        return ( box.min.y < -20 );
      case 2: 
        return ( box.max.x > 20 );
      case 3: 
        return ( box.min.x < -20 );
      case 4: 
        return ( box.max.z > 20 );
      case 5:
        return ( box.min.z < -20 );

    }
    

  }

  fueraTablero () {

    this.boxPieza.setFromObject(this.piezaActual);

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
      this.piezaActual.position.x -= (this.boxPieza.max.x - 5);
    }
    else if( this.boxPieza.min.x < -5 ){
      this.piezaActual.position.x += (-5 - this.boxPieza.min.x);
    }
    
  }

  fueraLimitesY(){

    if( this.boxPieza.max.y > 5 ){
      this.piezaActual.position.y -= (this.boxPieza.max.y - 5);
    }
    else if( this.boxPieza.min.y < -5 ){
      this.piezaActual.position.y += (-5 - this.boxPieza.min.y);
    }

  }

  fueraLimitesZ(){

    if( this.boxPieza.max.z > 5 ){
      this.piezaActual.position.z -= (this.boxPieza.max.z - 5);
    }
    else if( this.boxPieza.min.z < -5 ){
      this.piezaActual.position.z += (-5 - this.boxPieza.min.z);
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
      this.axisOnOff = false;
      this.limits = false;
    }
    
    var folder = gui.addFolder('Debug');
    folder.add(this.guiControls, 'axisOnOff').name('Mostrar ejes : ').listen().onChange((axisOnOff) => {
      this.axis.visible = axisOnOff;
    });
    
    folder.add(this.guiControls, 'limits').name('Mostrar límites : ').listen().onChange((limits) => {
      this.helperPieza.visible = limits;
      this.helperTablero.visible = limits;
    });
    
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

    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render(this, this.getCamera());

    // Modifica la luz que sale de la pieza a la posición de la pieza
    this.pointLight.position.set(this.piezaActual.position.x, this.piezaActual.position.y, this.piezaActual.position.z);

    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();

    // --------------------------------------
    // ACTUALIZACIÓN DE MODELOS
    // --------------------------------------
    if(this.jugando){

      // this.piezaActual.actualizarRayos();
      this.boxPieza.setFromObject(this.piezaActual);

      // Se calcula en base al delta, la distancia a recorrer.
      // Se calcula aquí, ya que se necesita para saber si van a colisionar
      const tiempoTranscurrido = this.piezaActual.tiempo.getDelta();
      this.piezaActual.lastDistance = 20 * ( tiempoTranscurrido / this.piezaActual.segundos );

      if( this.piezaActual.movimiento && ( this.piezaActual.checkColision(this.tablero) || this.piezaActual.checkColision(this.bloquesTablero[this.caraActual]) ))
        this.colision();
      else{
        this.tablero.update();
        this.piezaActual.update();
      }

    }  
    
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

    switch (event.keyCode){
      case 65: 
        // A -> pieza hacia la izquierda
        scene.piezaActual.position.x -= scene.direccionHorizontal.x*scene.direccionCamara;
        scene.piezaActual.position.y -= scene.direccionHorizontal.y*scene.direccionCamara;
        scene.piezaActual.position.z -= scene.direccionHorizontal.z*scene.direccionCamara;
        scene.fueraTablero();
        break;
      case 87:
        // W -> pieza hacia delante
        scene.jugando = true;
        scene.piezaActual.position.x += scene.direccionVertical.x*scene.direccionCamara;
        scene.piezaActual.position.y += scene.direccionVertical.y*scene.direccionCamara;
        scene.piezaActual.position.z += scene.direccionVertical.z*scene.direccionCamara;
        scene.fueraTablero();
        break;
      case 68:
        // D -> pieza hacia la derecha
        scene.piezaActual.position.x += scene.direccionHorizontal.x*scene.direccionCamara;
        scene.piezaActual.position.y += scene.direccionHorizontal.y*scene.direccionCamara;
        scene.piezaActual.position.z += scene.direccionHorizontal.z*scene.direccionCamara;
        scene.fueraTablero();
        break;
      case 83:
        // S -> pieza hacia abajo
        scene.piezaActual.position.x -= scene.direccionVertical.x*scene.direccionCamara;
        scene.piezaActual.position.y -= scene.direccionVertical.y*scene.direccionCamara;
        scene.piezaActual.position.z -= scene.direccionVertical.z*scene.direccionCamara;
        scene.fueraTablero();
        break;
      case 70:
        // F ->  Rotar hacia la derecha
        scene.piezaActual.rotateOnWorldAxis(new THREE.Vector3(scene.ejeRotacionDerecha.x*scene.direccionCamara, scene.ejeRotacionDerecha.y*scene.direccionCamara, scene.ejeRotacionDerecha.z*scene.direccionCamara ), -Math.PI/2);
        scene.fueraTablero();
        break;
      case 82:
        // R -> Rotar hacia alante
        scene.piezaActual.rotateOnWorldAxis(new THREE.Vector3(scene.ejeRotacionAlante.x*scene.direccionCamara, scene.ejeRotacionAlante.y*scene.direccionCamara, scene.ejeRotacionAlante.z*scene.direccionCamara ), Math.PI/2);
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
      case 86:
        // V -> Para cambiar de pieza
        if(scene.cambioPieza){
          scene.generarPiezaAleatoria(true);
        }

        break;
    }

  })

  // Que no se nos olvide, la primera visualización.
  scene.update();
});
