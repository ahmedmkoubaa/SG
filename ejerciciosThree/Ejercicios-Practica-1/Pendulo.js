import * as THREE from '../libs/three.module.js'

class Pendulo extends THREE.Object3D {
	constructor(gui, titleGui){
		super();
		this.createGUI(gui, titleGui);

		this.longitudCentral = 1; // no puede ser mayor de 2
		this.penduloPrimario = this.createPenduloPrimario();
		this.penduloSecundario = this.createPenduloSecundario();
		this.penduloSecundario.position.set(0, -4, 1.5);

		this.add(this.penduloPrimario);
		this.add(this.penduloSecundario);
	}

	createPenduloPrimario() {
		// Falta devolver un objeto del tipo object3d, de manera que, cualquier
		// cambio que se realice sobre el pendulo grande, afecta a toda la estructura
		// tambien hay que pensar cómo hacer o mejor dicho, donde tocar exactamente
		// para que los cambios tengan efectos en un lado u otro

		var pendulo = new THREE.Object3D();

		this.inicioParteCentral = -4;

		this.extremoSuperior = this.createExtremo();
		this.extremoInferior = this.createExtremo();
		this.central  			= this.createCentral();

		// this.extremoSuperior.position.y = -2;							// Poner debajo del eje de coordenadas
		this.central.position.y 		  = this.inicioParteCentral;	// Poner debajo del extremo superior
		this.extremoInferior.position.y = -10;								// Poner debajo del pedazo central

		pendulo.add(this.extremoSuperior);
		pendulo.add(this.extremoInferior);
		pendulo.add(this.central);

		pendulo.position.y = 1;
		return pendulo;
	}

	createPenduloSecundario() {
		var mesh = new THREE.Mesh (new THREE.BoxGeometry(1, 1, 1),
											new THREE.MeshPhongMaterial({color: 0x0000FF}));

		mesh.position.set(0, -0.5, 0);
		this.nodo1 = new THREE.Object3D();
		this.nodo1.add(mesh);

		this.nodo1.position.y = 1.0;	// subirlo un poco

		this.nodo2 = new THREE.Object3D();
		this.nodo2.add(this.nodo1);

		return this.nodo2;
	}

	createExtremo() {
		var extremoOBJ = new THREE.Object3D();

		var extremoGeometry = new THREE.BoxGeometry(2, 4, 2)
		var extremoMaterial = new THREE.MeshPhongMaterial({color:0x00FF00});
		var extremoMesh = new THREE.Mesh(extremoGeometry, extremoMaterial);

		extremoMesh.position.y = -2;
		extremoOBJ.add(extremoMesh);

		return extremoOBJ;
	}

	createCentral() {
		var parteCentral = new THREE.Object3D();

		var centralGeo  = new THREE.BoxGeometry(2, 5, 2)
		var centralMat  = new THREE.MeshPhongMaterial({color:0xFF0000});
		var centralMesh = new THREE.Mesh(centralGeo, centralMat);

		centralMesh.position.set(0, -2.5, 0);
		parteCentral.add(centralMesh);

		return parteCentral;
	}

	// Para crear una interfaz con la que interactuar con el modelo jerarquico
	createGUI(gui, titleGui) {
		this.guiControls = new function () {
			this.longitudCentral = 1.0;
			this.rotacionPrimario = 0.0;

			this.longitudSecundario = 10.0;
			this.posicion = 10.0;
			this.giro = 0;

			this.reset = function () {
				this.longitudCentral = 1.0;
				this.rotacionPrimario = 0.0;

				this.rotaionSecundario = 0.0;
				this.posicion = 10.0;
				this.giro = 0;
			}
		}

		var folderPrimario = gui.addFolder('pendulo primario');
		var folderSecundario = gui.addFolder('pendulo secundario');

		folderPrimario.add(this.guiControls, 'longitudCentral', 1.0, 2.0, 0.1).name('longitud').listen();
		folderPrimario.add(this.guiControls, 'rotacionPrimario', -0.785398, +0.785398, 0.1).name('rotación').listen();

		folderSecundario.add(this.guiControls, 'longitudSecundario', 10, 20, 1).name('longitud').listen();
		folderSecundario.add(this.guiControls, 'posicion', 10, 90, 1).name('posición (%)').listen();
		folderSecundario.add(this.guiControls, 'giro', -0.785398, +0.785398, 0.1).name('giro').listen();
	}

	update() {
		this.estirarPrimario();
		this.rotarPrimario();

		this.estirarSecundario();
		this.desplazarSecundario();
		this.rotarSecundario();
	}

	estirarPrimario() {
		this.finParteCentral = -9 - (this.guiControls.longitudCentral - 1) * 5;

		this.central.scale.y = this.guiControls.longitudCentral;
		this.extremoInferior.position.y = this.finParteCentral;
	}

	rotarPrimario() {
		this.rotation.z = this.guiControls.rotacionPrimario;
	}

	estirarSecundario() {
		this.nodo1.scale.y = this.guiControls.longitudSecundario;

		// this.penduloSecundarioCentral.position.y = -5;
	}

	desplazarSecundario() {
		var longitudParteCentral = Math.abs(this.finParteCentral) - Math.abs(this.inicioParteCentral);
		var posicionPorcentaje = (this.guiControls.posicion / 100.0);

		// this.penduloSecundario.position.y = 2+
		// 	this.inicioParteCentral - (posicionPorcentaje * longitudParteCentral);

		this.nodo2.position.y =
			this.inicioParteCentral - (posicionPorcentaje * longitudParteCentral);

	}

	rotarSecundario() {
		this.nodo2.rotation.z = this.guiControls.giro;
	}
};

export { Pendulo };
