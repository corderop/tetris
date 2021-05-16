
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

    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);

    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI();

    // Construimos los distinos elementos que tendremos en la escena

    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. 
    // Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights();

    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera();

    // Creación de ejes en el origen de coordenadas de tamaño 
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
    this.caraPrevia = 0;

    // Tiene los mismos valores que caraActual. Será la posición en la que 
    // actualmente ese jugador está mirando para tenerlo en cuenta a la hora de
    // moverse
    this.direccionCamara = 0;

    // this.TPieza.moverAPuntoDeInicio(this.caraActual);
    this.generarPiezaAleatoria();
    
  }

  generarPiezaAleatoria() {

    const tipo = getRandomInt(5);
    let pieza = undefined;
    
    switch (tipo){
      case 0:
        pieza = new Cubo();
        break;
      case 1:
        pieza = new L();
        break;
      case 2:
        pieza = new Larga();
        break;
      case 3: 
        pieza = new T();
        break;
      case 4:
        pieza = new ZigZag();
        break;
    }

    this.piezaActual = this.piezas.length;
    this.piezas.push(pieza);
    this.add(this.piezas[this.piezaActual]);

    this.caraActual = getRandomInt(6);

    this.piezas[this.piezaActual].moverAPuntoDeInicio(this.caraActual);


  }

  createCamera() {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // this.camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2 ,window.innerHeight/-2, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set(30,30,30);
    // Y hacia dónde mira
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.up = new THREE.Vector3(0,1,0);
    this.camera.lookAt(look);
    this.add(this.camera);

    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new OrbitControls(this.camera, this.renderer.domElement);
    // // Se configuran las velocidades de los movimientos
    // this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = 5;
    // this.cameraControl.panSpeed = 0.5;
    // // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
  }

  createGUI() {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();

    // La escena le va a añadir sus propios controles. 
    // Se definen mediante una   new function()
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = new function () {
      // En el contexto de una función   this   alude a la función
      this.axisOnOff = true;
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder('Luz y Ejes');

    // Y otro para mostrar u ocultar los ejes
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
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();

    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0x000000), 1.0);

    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);

    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);

    return renderer;
  }

  getCamera() {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }

  setCameraAspect(ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect(window.innerWidth / window.innerHeight);

    // Y también el tamaño del renderizador
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update() {
    // Se actualizan los elementos de la escena para cada frame
    // Se actualiza la intensidad de la luz con lo que haya indicado el usuario en la gui
    this.pointLight.position.set(this.piezas[this.piezaActual].position.x, this.piezas[this.piezaActual].position.y, this.piezas[this.piezaActual].position.z);

    // Se muestran o no los ejes según lo que idique la GUI
    this.axis.visible = this.guiControls.axisOnOff;

    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();

    // --------------------------------------
    // ACTUALIZACIÓN DE MODELOS PARA EL EXAMEN
    // --------------------------------------
    this.tablero.update();
    
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render(this, this.getCamera());

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }
}

/// La función   main
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
        scene.piezas[scene.piezaActual].position.x += -1;
        break;
      case 87:
        // W -> pieza hacia delante
        scene.piezas[scene.piezaActual].position.z += -1;
        break;
      case 68:
        // D -> pieza hacia la derecha
        scene.piezas[scene.piezaActual].position.x += 1;
        break;
      case 83:
        // S -> pieza hacia abajo
        scene.piezas[scene.piezaActual].position.z += 1;
        break;
      case 70:
        // F ->  Rotar hacia la derecha
        scene.piezas[scene.piezaActual].rotateOnWorldAxis(new THREE.Vector3(1,0,0), -Math.PI/2);
        console.log(scene.piezas[scene.piezaActual].up);
        break;
      case 82:
        // R -> Rotar hacia la izquierda
        scene.piezas[scene.piezaActual].rotateOnWorldAxis(new THREE.Vector3(0,0,1), Math.PI/2);
        console.log(scene.piezas[scene.piezaActual].up);
        break;
      case 67:
        // C -> Para cambiar la dirección de la cámara
        scene.camera.up = new THREE.Vector3(0,scene.camera.up.y*(-1),0);
        scene.cameraControl.rotateSpeed *= -1; // Para que gire en el sentido contrario
        scene.camera.position.y *= -1;
        scene.cameraControl.update();
        break;
    }

  })

  // Que no se nos olvide, la primera visualización.
  scene.update();
});
