
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { ThreeBSP } from '../libs/ThreeBSP.js'
import * as TWEEN from '../libs/tween.esm.js'


// Clases de mi proyecto
import { Camino } from './Camino.js'
import { Personaje } from './Personaje.js'
import { ClasePlantilla } from './ClasePlantilla.js'
import { MyLoadedModel } from './MyLoadedModel.js'

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();

    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);

    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI ();

    // Construimos los distinos elementos que tendremos en la escena

    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights ();

    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera ();

    // Un suelo
    this.createGround ();

    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    this.axis = new THREE.AxesHelper (5);
    this.add (this.axis);

	 // --------------------------- OBSERVACIONES ---------------------------- //
	 // Con el proposito de facilitar la correccion al examinador
	 // se han marcado las zonas mas importantes del codigo con la
	 // palabra: EXAMEN. También se han marcado las partes cruciales
	 // para encontrarlas, podemos buscar lo siguiente con CTRL + F
	 //		1.- CREACION DE OBJETOS
	 //		2.- CREACION DE ANINACIONES
	 // 		3.- CREACION DE TRANSFORMACIONES ELEMENTALES
	 // 		4.- CREACION DE UPDATES
	 // (*) Los numeros (1,2,3, etc) son meramente informativos, buscar a
	 // partir de CREACION
	 // NOMBRE: AHMED EL MOUKHTARI KOUBAA, DNI: 44073794K;

	 // ------------------------------- EXAMEN ------------------------------- //
	 // -----------------------------------------------------------------------//
	 // CREACION DE OBJETOS
	 this.raycaster = new THREE.Raycaster ();  // To select boxes


	 this.factorNivel = 0.01; // incremento de dificultad entre un nivel y otro (es un valor entre 0 y 1)
	 this.puntos = 20;
	 this.longitud = 30;
	 this.numeroObstaculos = 100;
	 this.maxDesplzamiento = 5;

	 var factor = 1.25;
	 var tiempoEnMs = 1000 * (this.puntos + this.longitud) * factor;

	 this.personaje = new Personaje(this.gui, "Controles del personaje", this.maxDesplzamiento);
	 this.add(this.personaje);


	 this.camino = new Camino(this.puntos, this.longitud, this.numeroObstaculos);
	 this.add(this.camino);

	 this.obstaculos = this.camino.obstaculosGenerados;
	 this.siguienteObstaculo = 0;

	 // -----------------------------------------------------------------------//
	 // CREACION DE ANIMACIONES

	 var origen = {y: 0.0};
	 var destino = {y: 1.0};

	 // cambiando el tiempo cambiamos el tipo de
	 // trayectoria, helicoidal o saltarina


	 this.recorrerCamino = new TWEEN.Tween(origen).to(destino, tiempoEnMs);
	 this.recorrerSiguiente = new TWEEN.Tween(origen).to(destino, tiempoEnMs);

	 var that = this;
	 this.recorrerCamino
	 .onUpdate(function(){
		 that.actualizaPosicionEnSpline(that.personaje, that.camino.getSpline(), origen.y);
	 })
	 .onComplete(function(){
		 origen.y = 0.0;
		 // that.siguienteObstaculo = 0;

		 that.pasarDeNivel();
		 // that.recorrerSiguiente.start();
	 })
	 .chain(this.recorrerSiguiente);


	 this.recorrerSiguiente
	 .onUpdate(function(){
		 that.actualizaPosicionEnSpline(that.personaje, that.camino.getSpline(), origen.y);
	 })
	 .onComplete(function(){
		 origen.y = 0.0;
		 // that.siguienteObstaculo = 0;

		 that.pasarDeNivel();
		 // that.recorrerCamino.start();
	 })
	 .chain(this.recorrerCamino);


	 this.recorrerCamino.start();

	 // -----------------------------------------------------------------------//
	 // CREACION DE TRANSFORMACIONES ELEMENTALES

    // Por último creamos el modelo.
    // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a
    // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.

	 // this.camera = this.personaje.camera;
  }

  pasarDeNivel() {
	  this.remove(this.camino);
	  this.puntos += this.factorNivel * this.puntos;

	  // this.longitud += this.factorNivel * this.longitud;
	  this.numeroObstaculos += 10 * this.factorNivel * this.obstaculos.length;

	  this.camino = new Camino(this.puntos, this.longitud, this.numeroObstaculos);
	  this.add(this.camino);

	  this.obstaculos = this.camino.obstaculosGenerados;
	  this.siguienteObstaculo = 0;
  }

  actualizaPosicionEnSpline(objeto, spline, t){
	  var posicion = spline.getPointAt(t);
	  objeto.position.copy(posicion);

	  var tangente = spline.getTangentAt(t);
	  posicion.add(tangente);

	  objeto.lookAt(posicion);
  }

  comprobarColisiones() {
	  // Esta es la posicion real del actor en el mundo
	  // var posicionRealActor = this.personaje.actor.getWorldPosition(new THREE.Vector3());

	  var posicion = this.personaje.position.clone();
	  var posicionActor = this.personaje.actor.position.clone();
	  var rotacionActual = this.personaje.rotation.clone();

	  posicionActor.applyAxisAngle(new THREE.Vector3(1, 0, 0), +rotacionActual.x);
	  posicionActor.applyAxisAngle(new THREE.Vector3(0, 1, 0), +rotacionActual.y);
	  posicionActor.applyAxisAngle(new THREE.Vector3(0, 0, 1), +rotacionActual.z);

	  posicion.x += posicionActor.x;
	  posicion.y += posicionActor.y;
	  posicion.z += posicionActor.z;

	  var siguiente = this.siguienteObstaculo;
	  siguiente %= this.obstaculos.length;

	  // comprobar que la distancia al actual siguiente obstaculo es menor
	  // que la distancia al siguiente del siguiente actual, si estamos mas
	  // cerca del segundo que del primero, entonces tenemos actualizar el
	  // siguiente actual, es decir, buscamos que el siguiente sea el más próximo.
	  if ((siguiente+1 < this.obstaculos.length)  			 &&
		 posicion.distanceTo(this.obstaculos[siguiente].position) >
			 posicion.distanceTo(this.obstaculos[siguiente+1].position)) {

			 // avanzamos al siguiente al siquiente
			 siguiente++;
	  }

	  if (posicion.distanceTo(this.obstaculos[siguiente].position) < 1) {
		  alert("Ha habido colisión");
	  }

	  this.siguienteObstaculo = siguiente;
  }

  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set (20, 10, 20);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);

    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);

    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
  }

  createGround () {
    // El suelo es un Mesh, necesita una geometría y un material.

    // La geometría es una caja con muy poca altura
    var geometryGround = new THREE.BoxGeometry (50,0.2,50);
	 // var geometryGround = new THREE.CylinderGeometry(10,10, 0.1, 40);

    // El material se hará con una textura de madera
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshPhongMaterial ({map: texture});

    // Ya se puede construir el Mesh
    var ground = new THREE.Mesh (geometryGround, materialGround);

    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -0.1;

    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add (ground);
  }

  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();

    // La escena le va a añadir sus propios controles.
    // Se definen mediante una   new function()
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = new function() {
      // En el contexto de una función   this   alude a la función
      this.lightIntensity = 0.5;
      this.axisOnOff = true;
		this.cameraPersonaje = true;
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');

    // Se le añade un control para la intensidad de la luz
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1).name('Intensidad de la Luz : ');

    // Y otro para mostrar u ocultar los ejes
    folder.add (this.guiControls, 'axisOnOff').name ('Mostrar ejes : ');

	 folder.add (this.guiControls, 'cameraPersonaje').name ('Ver camara del personaje : ');

    return gui;
  }

  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    // La añadimos a la escena
    this.add (ambientLight);

    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
    this.spotLight.position.set( 60, 60, 40 );
    this.add (this.spotLight);
  }

  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();

    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);

    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);

    return renderer;
  }

  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camaraFinal;
  }

  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }

  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);

    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  update () {
    // Se actualizan los elementos de la escena para cada frame
    // Se actualiza la intensidad de la luz con lo que haya indicado el usuario en la gui
    this.spotLight.intensity = this.guiControls.lightIntensity;

    // Se muestran o no los ejes según lo que idique la GUI
    this.axis.visible = this.guiControls.axisOnOff;

	 // ------------------------------- EXAMEN ------------------------------- //
	 // CREACION DE UPDATES
	 this.camino.update();
	 this.personaje.update();

	 TWEEN.update();
	 this.comprobarColisiones();


	 if (this.guiControls.cameraPersonaje) {
		  this.camaraFinal = this.personaje.camera;
	 } else {
		 this.camaraFinal = this.camera;
		 // Se actualiza la posición de la cámara según su controlador
		 this.cameraControl.update();
	 }

    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.camaraFinal);


    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }

  onKeyDown (event) {
    var x = event.which || event.keyCode;
	 switch(x){
		 case 37: x = MyScene.IZQUIERDA; break;
		 case 38: x = MyScene.ARRIBA; 	break;
		 case 39: x = MyScene.DERECHA; 	break;
		 case 40: x = MyScene.ABAJO;		break;
	 }

	 switch (x) {
  	 	case MyScene.ARRIBA:
			this.personaje.goUp();
  			console.log("arriba"); break;

		case MyScene.ABAJO:
			this.personaje.goDown();
			console.log("abajo"); break;

		case MyScene.IZQUIERDA:
			this.personaje.goLeft();
			console.log("izquierda"); break;

		case MyScene.DERECHA:
			this.personaje.goRight();
			console.log("derecha"); break;

		default:
			console.log("Pulsaste " + x); break;
	 }
  }

  getMouse (event) {
    	var mouse = new THREE.Vector2 ();
    	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    	mouse.y = 1 - 2 * (event.clientY / window.innerHeight);
    	return mouse;
  	}

  	onMouseDown (event) {
		var mouse = this.getMouse (event);
		this.camino.updateMatrixWorld();
		this.updateMatrixWorld();

		this.raycaster.setFromCamera (mouse, this.getCamera());
		var pickedObjects = this.raycaster.intersectObjects (this.obstaculos, true);

		if (pickedObjects.length > 0) {
		  	var encontrado = pickedObjects[0].object;
			var index = this.obstaculos.indexOf(encontrado);

			this.obstaculos.splice(index, 1);
			this.camino.remove(encontrado);
	  }
	}
}

MyScene.ARRIBA 	= 87;
MyScene.ABAJO 		= 83;
MyScene.IZQUIERDA = 65;
MyScene.DERECHA 	= 68;



/// La función   main
$(function () {

  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());
  window.addEventListener ("keydown", (event) => scene.onKeyDown (event), true);
  window.addEventListener ("pointerdown", (event) => scene.onMouseDown(event), true);
  window.addEventListener ("pointerup", (event) => {console.log("pointer up");}, true);


  // Que no se nos olvide, la primera visualización.
  scene.update();
});
