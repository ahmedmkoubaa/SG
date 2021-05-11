import * as THREE from '../libs/three.module.js';

class ClasePlantilla extends THREE.Object3D {
	constructor (gui, titleGui){
		super();
		this.createGUI(gui, titleGui);

		// CREACION DE OBJETOS
		this.cajaPrueba = new THREE.Mesh(
			new THREE.BoxGeometry(2,3,2),
			new THREE.MeshPhongMaterial({color: 0xff0000})
		);

		this.add(this.cajaPrueba);

		// CREACION DE ANIMACIONES

		// CREACION DE TRANSFORMACIONES ELEMENTALES
		this.cajaPrueba.position.y = this.cajaPrueba.geometry.parameters.height/2;

	}

	createGUI(gui, titleGui){
		// CREACION DE GUI
		this.guiControls = new function (){
			// variables que queramos toquetear
			this.incrementoRotacion = 0;
			this.posX = 0;
			this.posZ = 0;
			this.posY = 0;
		}

		var folder = gui.addFolder(titleGui);
		folder.add(this.guiControls, 'incrementoRotacion', 0, 0.1, 0.01).name("Velocidad rotación: ").listen();
		folder.add(this.guiControls, 'posX', -10, 10, 1).name("Posición en x: ").listen();
		folder.add(this.guiControls, 'posZ', -10, 10, 1).name("Posición en Z: ").listen();
		folder.add(this.guiControls, 'posY', -10, 10, 1).name("Posición en Y: ").listen();
	}

	update(){
		// CREACION DE UPDATES
		this.rotation.y += this.guiControls.incrementoRotacion;
		this.position.x = this.guiControls.posX;
		this.position.z = this.guiControls.posZ;
		this.position.y = this.guiControls.posY;

	}
};


export { ClasePlantilla };
