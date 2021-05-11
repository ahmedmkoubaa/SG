import * as THREE from '../libs/three.module.js'

class MyTorus extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();		// llamar a super, esto es como un java no? que se crease todo lo heredado

		// Vamos a crear primero la interfaz de usuario porque la usaran otros metodos
		this.createGUI(gui, titleGui);

		// Vamos a crear ahora la geometría del objeto
		var geometry = new THREE.TorusGeometry( 0.4, 0.1, 15, 15 );
		var material = new THREE.MeshNormalMaterial( { color: 0xffff00, flatShading: true } );
		material.needsUpdate = true;
		var torus = new THREE.Mesh( geometry, material );

		this.add(torus);

	}

	createGUI (gui,titleGui) {
	  	// Controles para el tamaño, la orientación y la posición de la caja
	  	this.guiControls = new function () {
			this.radius 		  = 1.0;
			this.tube   		  = 1.0;
			this.radialSegments = 10;
			this.tubularSegments  = 10;

	  	  // Un botón para dejarlo todo en su posición inicial
	  	  // Cuando se pulse se ejecutará esta función.
	  	  this.reset = function () {
			  this.radius 		   = 1.0;
			  this.tube   		   = 1.0;
			  this.radialSegments = 10;
			  this.tubularSegments  = 10;
	  	  }
	  	}

	  	// Se crea una sección para los controles de la caja
	  	var folder = gui.addFolder (titleGui);



	  	// Estas lineas son las que añaden los componentes de la interfaz
	  	// Las tres cifras indican un valor mínimo, un máximo y el incremento
	  	// El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice

		folder.add(this.guiControls, 'radius', 1, 20, 0.1).name('Radio').listen();
		folder.add(this.guiControls, 'tube'  , 1, 20, 0.1).name('Tubo').listen();
		folder.add(this.guiControls, 'radialSegments', 2, 30, 1).name('Segmentos radio').listen();
		folder.add(this.guiControls, 'tubularSegments', 3, 70, 1).name('Segmentos tubo').listen();
	  	folder.add (this.guiControls, 'reset').name ('[ Reset ]');
   }

   update () {
		// aun no hay nada por aqui
		this.rotation.y += 0.1;
   }
}

export { MyTorus };
