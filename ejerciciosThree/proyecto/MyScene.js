
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { ThreeBSP } from '../libs/ThreeBSP.js'
import * as TWEEN from '../libs/tween.esm.js'


// Clases de mi proyecto
import { Camino } from './Camino.js'
import { Personaje } from './Personaje.js'
// import { ClasePlantilla } from './ClasePlantilla.js'
// import { MyLoadedModel } from './MyLoadedModel.js'

import { TipoRecompensa } from './TipoRecompensa.js'

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();

    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);


    // Construimos los distinos elementos que tendremos en la escena
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
	 this.raycaster = new THREE.Raycaster ();  // para poder seleccionar objetos de la escena

	 this.initJuego();								 // Inicializa variables de estado del juego

	 // crear persona, pasar numero de vidas y cuanto se desplazara
	 // como maximo del camino cuando se desplace
	 this.personaje = new Personaje(this.vidasPersonaje, this.maxDesplzamiento);
	 this.add(this.personaje);

	 // crear camino, pasar parametros necesarios
	 this.camino = new Camino(this.puntos, this.longitud, this.numeroObstaculos, this.personaje);
	 this.add(this.camino);


	 // VARIABLES DE CONTROL DEL JUEGO
	 this.partidaIniciada = false;				// Indica si se comenzo la partida o no
	 this.finJuego = false;							// variable controladora de fin de juego, si true -> finalizar juego
	 this.detectarColisiones = true;				// Indica si la deteccion esta activada o no
	 this.siguienteObstaculo = 0;					// Indicar siguiente obstaculo a comprobar

	 // obtenemos referencias a objetos del camino
	 this.obstaculos = this.camino.obstaculosGenerados;
	 this.recompensas = this.camino.recompensasGeneradas;

	 this.pickable = this.recompensas;			// vector de elementos que se pueden seleccionar clicando

	 // this.personaje.position.set(this.camino.spline.getPointAt(0));

	 // -----------------------------------------------------------------------//
	 // CREACION DE ANIMACIONES

	 this.crearAnimacionRecorrido();
	 this.crearAnimacionVerTodo();
	 this.crearAnimacionIntocable();
	 this.crearAnimacionEliminarObstaculos();
	 this.crearAnimacionVidaExtra();
	 this.crearAnimacionColisionar();


	 // -----------------------------------------------------------------------//
	 // CREACION DE TRANSFORMACIONES ELEMENTALES

	 // this.iniciarPartida();

    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights ();

    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera ();


	 this.createBackground();


  }

  initJuego() {
	  this.factorNivel = 0.01; 					// incremento de dificultad entre un nivel y otro (es un valor entre 0 y 1)
	  this.puntos = 20;								// puntos que tendra el camino
	  this.longitud = 30;							// longitud maxima entre puntos del camino
	  this.numeroObstaculos = 100;				// numero de obstaculos que tendra el camino
	  this.maxDesplzamiento = 5;					// desplazamiento con respecto al camino

	  this.bonusObstaculo = 100;					// Bonus por clicar obstaculo
	  this.bonusNivel = 1000;						// Bonus por pasar de nivel, se suma a puntuacion

	  this.puntuacion = 0;							// puntuacion conseguida en el juego
	  this.vidasPersonaje = 1;						// Numero de vidas inicial del personaje

	  this.partidaIniciada = false;				// Comienzo de partida a false por ahora
	  this.finJuego = false;						// Aun no hemos encontrado fin juego

  }

  // Metodo para comenzar una nueva partida, comenzamos a recorrer camino
  iniciarPartida() {
	  // Comenzar la animación de recorrer camino, equivalente a "iniciar juego"
	  this.recorrerCamino.start();
	  this.partidaIniciada = true;		// condicion de inicio
	  this.finJuego 		 = false;		// condicion de finalizacion

	  this.mensaje = "Comienza la partida, no te estrelles!!";
	  this.mensajeInicial = "";

  }

  // Metodo para finalizar partida, reseteamos
  finalizarPartida() {

	  this.recorrerCamino.stop();

	  // Restablecemos el personaje
	  this.personaje.position.set(0, 0, 0);
	  this.personaje.vidas = this.vidasPersonaje;

	  // Restablecemos el estado de la partida
	  var puntuacion = this.puntuacion;

	  // Notificamos al usuario
	  this.mensajeInicial =
					"FIN DEL JUEGO :( <br> Tu puntuación es " + puntuacion + " <br> PULSA ESPACIO PARA REINICIAR";

	  // Actualizamos el estado
	  this.actualizarEstado();

	  // Generamos un nuevo nivel
	  this.nuevoNivel();	// avanzamos de nivel
	  this.initJuego();	// inicializamos el juego nuevamente
  }

  // crea la animacion que se ejecutara cuando se detecte una colision
  // antes de comenzar disminuye el numero de vidas de un personaje
  // cambia el color del camino para notificar un evento
  crearAnimacionColisionar(tiempo = 1000) {
	 var origen = {x:0};
	 var destino = {x:1};

	 this.animacionColisionar = new TWEEN.Tween(origen).to(destino, tiempo);

	 var that = this;
	 this.animacionColisionar
	 .onStart(function() {
		  // Cambiar color a verde a modo de notificacion al usuario
		  that.camino.apariencia.material.color.setHex(0xFF0000);
		  that.personaje.vidas--;	// actualizar numero de vidas
		  that.mensaje = "Te has chocado y has perdido vidas";

		  // notificar html
	 })
	 .onComplete(function() {

		  // comprobamos numero de vidas restantes del personaje
		  if (that.personaje.vidas == 0) {
			  that.finJuego = true;				// si no hay mas vidas se emite fin de juego
		  } else {
			  // al completar, devolver color original si no hubo fin juego
			   that.camino.apariencia.material.color.setHex(0x0000FF);
		  }
	 });
  }

  // Animacion que se ejecuta cuando se clica la recompensa una vida extra
  // cambia el color del camino para notificar un evento
  crearAnimacionVidaExtra(tiempo = 1000) {
	  var origen = {x:0};
	  var destino = {x:1};

	  this.animacionVidaExtra = new TWEEN.Tween(origen).to(destino, tiempo);

	  var that = this;
	  this.animacionVidaExtra
	  .onStart(function() {
		  	// Cambiar color a verde a modo de notificacion al usuario
			that.camino.apariencia.material.color.setHex(0x00FF00);
			that.personaje.vidas++;	// actualizar numero de vidas
			that.mensaje = "Has gando una vida, sigue así!!";
	  })
	  .onComplete(function() {
		  	// al completar, devolver color original
			that.camino.apariencia.material.color.setHex(0x0000FF);
	  });
  }

  // Animacion que se ejecutara cuando se clique la recompensa
  // eliminar obstaculos, cambia de color el camino para notificar un evento
  crearAnimacionEliminarObstaculos(tiempo = 5000) {
	  var origen = {x:0};
	  var destino = {x:1};

	  this.animacionEliminarObstaculos = new TWEEN.Tween(origen).to(destino, tiempo);

	  var that = this;
	  this.animacionEliminarObstaculos
	  .onStart(function() {
		   // a partir de ahora se podran clicar los obstaculos
	 		that.pickable = that.camino.obstaculosGenerados;
			that.camino.apariencia.material.color.setHex(0xffff00);
			that.mensaje = "Toca los objetos para destruirlos y ganar puntos";
	  })
	  .onComplete(function() {
		   // clicar de nuevo las recompensas
	 	 	that.pickable = that.camino.recompensasGeneradas;
			that.camino.apariencia.material.color.setHex(0x0000ff);
			that.mensaje = " ";
	  });
  }

  // Animacion que se ejecutara cuando se clique la recompensa ver todo
  // hace el camino transparente para permitir ver todo el camino
  crearAnimacionVerTodo(tiempo = 10000) {
	  var origen = {x:0};
	  var destino = {x:1};

	  this.animacionVertTodo = new TWEEN.Tween(origen).to(destino, tiempo);

	  var that = this;
	  this.animacionVertTodo
	  .onStart(function(){
		  // that.camino.apariencia.material.transparent = true;
		  that.camino.apariencia.material.opacity = 0.3;
		  that.mensaje = "Ahora puedes ver el futuro, aprovecha!!";
	  })
	  .onComplete(function(){
		  // that.camino.apariencia.material.transparent = false;
		  that.camino.apariencia.material.opacity = 0.8;
		  that.mensaje = " ";
	  });
  }

  // Animacion que se ejecutara cuando se clique la recompensa "intocable"
  // se modifica el personaje para notificar el evento
  crearAnimacionIntocable(tiempo = 5000) {
	  var origen = {x:0};
	  var destino = {x:1};

	  this.animacionIntocable = new TWEEN.Tween(origen).to(destino, tiempo);

	  var that = this;
	  this.animacionIntocable
	  .onStart(function(){
		  // se desactivan las colisiones
		  that.detectarColisiones = false;

		  // modificar representacion grafica del personaje
		  that.personaje.setWireframe(true);
		  that.mensaje = "Los obstaculos no pueden tocarte, atraviésalos!!";
	  })
	  .onComplete(function(){
		  // se vuelven a activar las colisiones
		  that.detectarColisiones = true;

		  // desactivar la modificacion
		  that.personaje.setWireframe(false);
		  that.mensaje = " ";
	  });
  }

  // crea la animacion principal del juego que se encarga de simular como
  //  un objeto personaje de desplaza a traves del tubo principal
  crearAnimacionRecorrido() {
	  // origen y destino son realmente simbolicos
	  var origen = {y: 0.0};
	  var destino = {y: 1.0};

	  // nos sirve para manejar mejor el tiempo del recorrido
	  var factor = 1.25;

	  // el tiempo varia en funcion del numero de puntos y la longitud maxima
	  // se usa el factor para corregir y "1000" son los milisegundos por segundo
	  var tiempoEnMs = 1000 * (this.puntos + this.longitud) * factor;

	  // se crean dos animaciones que se encadenaran mas tarde para poder
	  // crear un bucle anidado entre ellas que nos permite definir comportamientos
	  // al finalizar la animacion, qué hacer mientras se está actualizando, etc
	  this.recorrerCamino = new TWEEN.Tween(origen).to(destino, tiempoEnMs);
	  this.recorrerSiguiente = new TWEEN.Tween(origen).to(destino, tiempoEnMs);

	  var that = this;

	  this.recorrerCamino
	  .onStart(function() {
		  origen.y = 0.0;
	  })
	  .onUpdate(function(){
		  that.actualizaPosicionEnSpline(that.personaje, that.camino.getSpline(), origen.y);
	  })
	  .onComplete(function(){
		  origen.y = 0.0;
		  that.nuevoNivel();

		  // cuando se completa un nivel, se suma el bonus
		  this.puntuacion += this.bonusNivel;
	  })
	  .chain(this.recorrerSiguiente);


	  this.recorrerSiguiente
	  .onStart(function(){
		  origen.y = 0.0;
	  })
	  .onUpdate(function(){
		  that.actualizaPosicionEnSpline(that.personaje, that.camino.getSpline(), origen.y);
	  })
	  .onComplete(function(){
		  origen.y = 0.0;
		  that.nuevoNivel();

		  // cuando se completa un nivel, se suma el bonus
		  this.puntuacion += this.bonusNivel;
	  })
	  .chain(this.recorrerCamino);
  }


  // Funcion que se ejecuta al terminar un nivel actualiza los parametros
  // de nivel y crea un nuevo recorrido algo mas complicado que el anterior
  nuevoNivel() {

	  // si el juego no ha terminado, incrementamos la dificultad
	  if (this.partidaIniciada && !this.finJuego){
		  // incrementar numero de puntos
		  this.puntos += this.factorNivel * this.puntos;
		  this.numeroObstaculos = this.puntos * 10;

		  // nuevo mensaje
		  this.mensaje = "Siguiente nivel, sigue así!!";
	  }

	  // crear nuevo camino con nuevos parametros
	  this.camino.regenerar(this.puntos, this.longitud, this.numeroObstaculos, this.personaje);

	  // reinicializar antiguos elementos del camino apuntando a vacio
	  this.obstaculos = this.recompenas = this.pickable = [];

	  // obtener objetos del nuevo camino
	  this.obstaculos = this.camino.obstaculosGenerados;
	  this.recompensas = this.camino.recompensasGeneradas;
	  this.pickable = this.recompensas;

	  this.detectarColisiones = true;			// por si hubiese finalizado mientras estaba desactivado
	  this.siguienteObstaculo = 0;				// indicar indice del siguiente obstaculo

  }

  // Metodo para actualizar la posicion del objeto dentro del spline
  // tanto como indique t
  actualizaPosicionEnSpline(objeto, spline, t){
	  // obtenemos nueva posicion y asignamos al objeto
	  var posicion = spline.getPointAt(t);
	  objeto.position.copy(posicion);

	  // calculamos tangente y actualizamos el objeto
	  var tangente = spline.getTangentAt(t);
	  posicion.add(tangente);
	  objeto.lookAt(posicion);
  }

  // Metodo que se encarga de detectar las colisiones del personaje
  // con otros objetos, tenemos un camino que es imposible saltarse, es secuencial
  // los obstaculos aparecen en el por lo que dependiendo de donde se encuentre el
  // personaje, los obstaculos mas proximos variaran
  comprobarColisiones() {
	  // si esta activada la deteccion de colisiones
	  const distanciaMinimaParaColision = 2;
	  var colision = false;				// falso hasta que se demuestre lo contrario

	  // Esta es la posicion real del actor en el mundo
	  var posicion = this.personaje.actor.getWorldPosition(new THREE.Vector3());

	  // obtenemos siguiente y evitamos desbordamiento
	  var siguiente = this.siguienteObstaculo;
	  siguiente %= this.obstaculos.length;

	  // comprobar que la distancia al actual siguiente obstaculo es menor
	  // que la distancia al siguiente del siguiente actual, si estamos mas
	  // cerca del segundo que del primero, entonces tenemos actualizar el
	  // siguiente actual, es decir, buscamos que el siguiente sea el más próximo.
	  while ((siguiente+1 < this.obstaculos.length)  			 &&
	    posicion.distanceTo(this.obstaculos[siguiente].position) >
	  	  posicion.distanceTo(this.obstaculos[siguiente+1].position)) {

			  console.log("buscando siguiente");
	  	  // avanzamos al siguiente del siquiente
	  	  siguiente++;
	  }

	  // si la posicion de nuestro personaje a esta a una distancia inferior
	  // a la indicada por distancia minima para colision, entonces hemos
	  // detectado una colision y se debe actuar en consecuencia
	  if ( (this.detectarColisiones) &&
	  	 posicion.distanceTo(this.obstaculos[siguiente].position) < distanciaMinimaParaColision) {

	  	 this.animacionColisionar.start(); // ejecutar animacion por colision
		 colision = true;
	  }

	  // actualizar siguiente obstaculo pase lo que pase
	  this.siguienteObstaculo = siguiente;

	  return colision;
  }

  // actualiza el estado de la partida mostrando la informacion del estado por HTML
  actualizarEstado() {
	  // Mostramos estado del HUD si no hubo fin juego
	  if (!this.finJuego && this.partidaIniciada) {
		  document.getElementById ("mensaje").innerHTML = "<h2>"+ this.mensaje +"</h2><br>";
		  document.getElementById("estado").innerHTML = "<h2> Puntuación: " + this.puntuacion + "</h2>";
		  document.getElementById("estado").innerHTML += "<h2> Vidas: " + this.personaje.vidas + "</h2><br>";
	  } else {
		  document.getElementById ("mensaje").innerHTML = " ";
		  document.getElementById("estado").innerHTML = " ";
	  }
	  document.getElementById("mensajeInicial").innerHTML = this.mensajeInicial;
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

  // metodo para crear un fondo de escena, cargamos imagenes
  // y asignamos la textura encontrada
  createBackground() {
	  // var urls = [
		//   "../imgs/cube_interestellar/xpos.png",
		//   "../imgs/cube_interestellar/xneg.png",
		//   "../imgs/cube_interestellar/ypos.png",
		//   "../imgs/cube_interestellar/yneg.png",
		//   "../imgs/cube_interestellar/zpos.png",
		//   "../imgs/cube_interestellar/zneg.png"
	  // ];
	  //
	  // var textureCube = new THREE.CubeTextureLoader().load( urls );
	  // this.background = textureCube;

	  var path="../../imgs/background/uw_sky/";
	  var format='.jpg';
	  // console.log(path+'px'+format);
	  var urls = [
		 path+'uw_rt'+format, path+'uw_lf'+format,
		 path+'uw_up'+format, path+'uw_dn'+format,
		 path+'uw_bk'+format, path+'uw_ft'+format
	  ];

	  var textureCube = new THREE.CubeTextureLoader().load(urls);
	  this.background=textureCube;
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



  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.5);
    // La añadimos a la escena
    this.add (ambientLight);

	 this.sol = new THREE.SpotLight( {color: 0x000000, intensity: 0.05 } );
	 this.sol.target = this.personaje.actor;
	 this.sol.position.set(0,600,60);
	 this.add(this.sol);

  }

  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();

    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);

	 renderer.shadowMap.enabled = true;

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

    // Se muestran o no los ejes según lo que idique la GUI
    // this.axis.visible = this.guiControls.axisOnOff;

	 // ------------------------------- EXAMEN ------------------------------- //
	 // CREACION DE UPDATES
	 // actualizamos los objetos que hemos incluido en nuestro juego

	 if (this.partidaIniciada) {

		 this.camino.update();
		 this.personaje.update();

		 // comprobar fin de juego
		 if (!this.finJuego) {
			 TWEEN.update();							// actualizar animaciones
			 this.comprobarColisiones();			// seguir comprobando colisiones
			 this.puntuacion++;						// Incrementar puntuacion de la partida

			 this.actualizarEstado();				// Actualizar informacion del estado
		 } else {
			 // notificar fin del juego
			 this.finalizarPartida();
		 }
	 }

	 // actualizar informacion de la vista
	 this.camaraFinal = this.personaje.getCamera();

    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.camaraFinal);


    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }

  // Metodo a ejecutar cuando ocurra el evento tecla pulsada
  onKeyDown (event) {
    var x = event.which || event.keyCode;

	 // 37, 38, 39, 40 se corresponden con las teclas de las flechas
	 // usamos este switch para detectarlas y transcribirlas
	 switch(x){
		 case 37: x = MyScene.IZQUIERDA; break;
		 case 38: x = MyScene.ARRIBA; 	break;
		 case 39: x = MyScene.DERECHA; 	break;
		 case 40: x = MyScene.ABAJO;		break;
	 }

	 // Decidir que tecla se pulso y que hacer en consecuencia
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

		case MyScene.CAMARA:
			this.personaje.cambiarCamara(); break;

		case MyScene.COMENZAR:
			this.iniciarPartida();
			break;

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
		var pickedObjects = this.raycaster.intersectObjects ( this.pickable , true);

		if (pickedObjects.length > 0) {
		  	var encontrado = pickedObjects[0].object;
			var index = this.pickable.indexOf(encontrado);

			switch (encontrado.tipo) {

				case TipoRecompensa.VER_TODO:
					this.animacionVertTodo.start();
					break;

				case TipoRecompensa.VIDA_EXTRA:
					this.animacionVidaExtra.start();
					break;

				case TipoRecompensa.INTOCABLE:
					console.log("Eres intocable");
					this.animacionIntocable.start();
					break;

				case TipoRecompensa.ELIMINAR_OBSTACULOS:
					this.animacionEliminarObstaculos.start();
					break;

				default:
					// Si no tiene tipo es porque no es un tipo de recompensa
					// es un obstaculo, damos entonces recompensa por clicarlo
					// y nos deshacemos de el

					this.puntuacion += this.bonusObstaculo;

					// si no encontré el indice del objeto picado, voy al padre
					if (index < 0) {
						encontrado = encontrado.parent;
						index = this.obstaculos.indexOf(encontrado);
					}

					// si el padre no lo contiene entonces voy al padre de este
					// si no encontré el indice del objeto picado, voy al padre
					if (index < 0) {
						encontrado = encontrado.parent;
						index = this.obstaculos.indexOf(encontrado);
					}


					console.log(encontrado);



					// Al ser un modelo cargado con la clase MyLoadedModel solo
					// lo podemos identificar por la posicion en la que se encuentra
					// La posicion es del myloadedmodel, que es lo que generamos como
					// obstaculo
					// var myLoadedModel = encontrado.parent.parent;
					// var pos = myLoadedModel.position;
					//
					// console.log("Hemos encontrado:  ");
					// console.log(encontrado);
					//
					// // Buscamos el indice en el vector
					// this.pickable.forEach((obj, i) => {
					// 	if (obj.position == pos) {
					// 		console.log("Hemos encontrado el indice");
					// 		encontrado = myLoadedModel;
					// 		return (index = i);
					// 	}
					// });

					break;
			}

			// Remover el objeto encontrado tanto del
			// vector de seleccionables como del objeto camino
			this.pickable.splice(index, 1);
			this.camino.remove(encontrado);
	  }
	}
}

// TECLAS WASD
MyScene.ARRIBA 	= 87;
MyScene.ABAJO 		= 83;
MyScene.IZQUIERDA = 65;
MyScene.DERECHA 	= 68;

// Tecla para cambiar de camara
MyScene.CAMARA = 67;

// Tecla para comenzar la partida
MyScene.COMENZAR = 32;

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
