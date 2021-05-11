import * as THREE from '../libs/three.module.js';

class Reloj extends THREE.Object3D {
	constructor (gui, titleGui){
		super();
		this.createGUI(gui, titleGui);

		// this.cajaPrueba = new THREE.Mesh(
		// 	new THREE.BoxGeometry(2,3,2),
		// 	new THREE.MeshPhongMaterial({color: 0xff0000})
		// );
		//
		// this.add(this.cajaPrueba);
		//
		// this.cajaPrueba.position.y = this.cajaPrueba.geometry.parameters.height/2;

		var reloj = new THREE.Object3D();



		const numeroMarcas = 12;
		var distanciaAlCentro = 5;
		this.gradosPorMarca = (2*Math.PI/numeroMarcas);

		var reloj = new THREE.Object3D();
		const nuevaMarca = new THREE.Object3D();
		var marca = new THREE.Mesh(
			new THREE.SphereBufferGeometry(1),
			new THREE.MeshNormalMaterial({color: 0xff00ff})
		);

		marca.position.y = distanciaAlCentro;


		for (var i = 0; i < numeroMarcas; i++){
			nuevaMarca.add(marca);
			nuevaMarca.rotation.z = i * this.gradosPorMarca;
			reloj.add(nuevaMarca.clone());
		}

		reloj.position.y = distanciaAlCentro + marca.geometry.parameters.radius;
		this.add(reloj);

		this.nodoAguja = new THREE.Object3D();
		var aguja = new THREE.Mesh(
			new THREE.BoxBufferGeometry(0.5, 4.5, 0.5),
			new THREE.MeshNormalMaterial({color:0xffffff})
		);

		aguja.position.y = aguja.geometry.parameters.height/2 - 1;
		this.nodoAguja.add(aguja);

		this.nodoAguja.position.y = distanciaAlCentro + marca.geometry.parameters.radius;

		this.add(this.nodoAguja);

		this.tiempoAnterior = new Date();

	}

	createGUI(gui, titleGui){
		this.guiControls = new function (){
			// variables que queramos toquetear
			this.incrementoRotacion = 0;
			this.posX = 0;
			this.posZ = 0;
			this.posY = 0;
			this.marcasPorSegundo = 0;
		}

		var folder = gui.addFolder(titleGui);
		folder.add(this.guiControls, 'incrementoRotacion', 0, 0.1, 0.01).name("Velocidad rotación: ").listen();
		folder.add(this.guiControls, 'posX', -10, 10, 1).name("Posición en x: ").listen();
		folder.add(this.guiControls, 'posZ', -10, 10, 1).name("Posición en Z: ").listen();
		folder.add(this.guiControls, 'posY', -10, 10, 1).name("Posición en Y: ").listen();
		folder.add(this.guiControls, 'marcasPorSegundo', -12, 12, 1).name("Marcas/segundos: ").listen();
	}

	update(){
		this.rotation.y += this.guiControls.incrementoRotacion;
		this.position.x = this.guiControls.posX;
		this.position.z = this.guiControls.posZ;
		this.position.y = this.guiControls.posY;

		var tiempoTranscurrido = (new Date() - this.tiempoAnterior)/1000;
		this.nodoAguja.rotation.z += this.guiControls.marcasPorSegundo * this.gradosPorMarca * tiempoTranscurrido;

		this.tiempoAnterior = new Date();

	}
};


export { Reloj };
