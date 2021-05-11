import * as THREE from '../libs/three.module.js'

class Reloj extends THREE.Object3D {
	constructor(gui, titleGui){
		super();
		this.createGUI(gui, titleGui);

		this.aguja = new THREE.Mesh(
				new THREE.SphereGeometry(1),
				new THREE.MeshPhongMaterial({color: 0xffff00})
		);

		const marcasHoras = 12;
		const distanciaOrigenMarca = 10;
		const distanciaOrigenAguja = distanciaOrigenMarca * 0.6;
		this.distanciaEntreMarcas = (( 2 * Math.PI) / marcasHoras);

		for (var i = 0; i < marcasHoras; i++) {
			var nuevaMarca = this.crearMarca();
			nuevaMarca.geometry.translate(0, 0, distanciaOrigenMarca);
			nuevaMarca.geometry.rotateY(this.distanciaEntreMarcas * i);

			this.add(nuevaMarca);
		}

		this.add(this.aguja);
		this.aguja.geometry.translate(0, 0, distanciaOrigenAguja);

		this.startTime = this.endTime = 0;
	}

	crearMarca() {
		var marca = new THREE.Mesh(
				new THREE.BoxGeometry(1,1,4),
				new THREE.MeshPhongMaterial({color: 0xffff00})
		);

		return marca;
	}

	createGUI(gui, titleGui){
		this.guiControls = new function() {
			this.numeroMarcas = 0;
		}

		var folder = gui.addFolder(titleGui);
		folder.add(this.guiControls,'numeroMarcas', -12, 12, 1).name('marcas/segundo').listen();
	}

	update () {
		// Se cuenta cuanto tiempo ha pasado desde la ultima vez que se llamo
		// a este metodo y en base a ese tiempo transcurrido si realiza una regla de 3
		// si en 1 segundo nos desplazamos tantas marcas, en "x" milisegundos nos desplazaremos "y"
		this.aguja.rotation.y += this.guiControls.numeroMarcas * this.distanciaEntreMarcas * this.end();
		this.start();
	}

	start() {
	  this.startTime = new Date();
	}

	end() {
	  this.endTime = new Date();
	  var timeDiff = this.endTime - this.startTime; //in ms
	  // strip the ms
	  timeDiff /= 1000;

	  return timeDiff;
	}
};

export { Reloj };
