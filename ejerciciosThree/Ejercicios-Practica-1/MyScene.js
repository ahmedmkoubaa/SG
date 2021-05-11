
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { ThreeBSP } from '../libs/ThreeBSP.js'

// Clases de mi proyecto

import { MyBox } from './MyBox.js'
import { MySphere } from './MySphere.js'
import { MyTorus } from './MyTorus.js'
import { MyCylinder } from './MyCylinder.js'
import { ObjetoRevolucion } from  './ObjetoRevolucion.js'
import { Barrido } from  './Barrido.js'
import { MyTaza } from './MyTaza.js'
import { MyVessel } from './MyVessel.js'
import { MyLoadedModel } from './MyLoadedModel.js'
import { Pendulo } from './Pendulo.js'
import { Reloj } from './Reloj.js'
import { MiRecorrido } from './MiRecorrido.js'
import { RecorridoGenerico } from './RecorridoGenerico.js'

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

    // Por último creamos el modelo.
    // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a
    // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.
	 this.torus 	= new MyTorus(this.gui, 	"Controles del toro");
	 this.box 		= new MyBox(this.gui, 	 	"Controles de la Caja");
	 this.sphere 	= new MySphere(this.gui, 	"Controles de la esfera");
	 this.cilindro = new MyCylinder(this.gui, "Controles del cilindro");
	 this.taza 		= new MyTaza(this.gui, 		"controles de la taza");
	 this.vessel 	= new MyVessel(this.gui, 	"controles de la vasija");
	 this.model		= new MyLoadedModel('../models/porsche911/911.mtl', '../models/porsche911/Porsche_911_GT2.obj');
	 	 // this.model		= new MyLoadedModel('../models/bugatti/bugatti.mtl', '../models/bugatti/bugatti.obj');

	 this.pendulo = new Pendulo(this.gui, "controles del péndulo");
	 this.reloj = new Reloj(this.gui, "controles del reloj");
	 this.recorrido = new MiRecorrido(this.gui, "controles del recorrido");

	 var ptsSpline = [];
	 var numeroGenerarPuntos = 20;
	 var maxLongitud = 20;

	 var anterior = {x: 0, y: 0, z: 0};

	 for (var i = 0; i < numeroGenerarPuntos; i++) {
		 var x = anterior.x;
		 var y = anterior.y;
		 var z = anterior.z;

		 var nuevaCoordenada = Math.random() * maxLongitud;
		 switch (i%3) {
		 	case 0: x = nuevaCoordenada; break;
			case 1: y = nuevaCoordenada; break;
			case 2: z = nuevaCoordenada; break;
		 	default: break;
		 }

		 ptsSpline.push(new THREE.Vector3(x, 1, z));
		 anterior = {x:x, y:y, z:z};
	 }

	 var spline = new THREE.CatmullRomCurve3(ptsSpline);
	 this.recorridoGenerico = new RecorridoGenerico(this.model, spline);

	 var perfil = [];

	 perfil.push (new THREE.Vector3 (1, 0, 0));
	 perfil.push (new THREE.Vector3 (2, 1, 0));
	 perfil.push (new THREE.Vector3 (2, 2, 0));
	 perfil.push (new THREE.Vector3 (2, 3, 0));
	 perfil.push (new THREE.Vector3 (1, 4, 0));
	 perfil.push (new THREE.Vector3 (1, 5, 0));

	 this.objetoRevolucion = new ObjetoRevolucion(this.gui, "Controles del objeto revolucion", perfil);
	 this.barrido = new Barrido(this.gui, "Controles del objeto por barrido");

	 this.sphere.position.set(3, 0.0, 0);

	 this.torus.position.set(6, 0.5, 0);

	 this.cilindro.position.set(9, 0.0, 0);

	 this.objetoRevolucion.position.set(12, 0.0, 0);

	 this.barrido.position.set(15,1,0);

	 this.taza.position.set(0, 0.5 ,5);

	 this.vessel.position.set(0, 5, 0);

	 this.model.position.set(6, 0.6, 4);
	 this.model.rotation.y = 3.141597;

	 this.pendulo.position.set(6, -10, 6);

	 this.reloj.position.set(-5, 4, 0);
	 this.reloj.rotation.x = -Math.PI/2;
	 this.reloj.scale.set(0.3, 0.3, 0.3);

	 this.recorrido.position.y = 10;

	 this.recorridoGenerico.position.set(10, 10, 10);


    this.add (this.box);
	 this.add (this.sphere);
	 this.add (this.torus);
	 this.add (this.cilindro);
	 this.add (this.objetoRevolucion);
	 this.add (this.barrido);
	 this.add (this.taza);
	 this.add (this.vessel);
	 this.add (this.model);
	 this.add (this.pendulo);
	 this.add (this.reloj);
	 this.add (this.recorrido);
	 this.add (this.recorridoGenerico);
	 
	 this.camera = this.model.camera;
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
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');

    // Se le añade un control para la intensidad de la luz
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1).name('Intensidad de la Luz : ');

    // Y otro para mostrar u ocultar los ejes
    folder.add (this.guiControls, 'axisOnOff').name ('Mostrar ejes : ');

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
    return this.camera;
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

    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();

    // Se actualiza el resto del modelo
    this.box.update();
	 this.sphere.update();
	 this.torus.update();
	 this.cilindro.update();
	 this.objetoRevolucion.update();
	 this.barrido.update();
	 this.taza.update();
	 this.pendulo.update();
	 this.reloj.update();
	 this.recorrido.update();
	 this.recorridoGenerico.update();

    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());


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
  window.addEventListener ("resize", () => scene.onWindowResize());

  // Que no se nos olvide, la primera visualización.
  scene.update();
});
