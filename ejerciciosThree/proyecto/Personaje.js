import * as THREE from '../libs/three.module.js';

class Personaje extends THREE.Object3D {
	constructor (gui, titleGui){
		super();
		this.createGUI(gui, titleGui);

		// CREACION DE OBJETOS
		var texture = new THREE.TextureLoader().load('../imgs/cara.jpg');
		var material = new THREE.MeshPhongMaterial ({map: texture});

		this.actor = new THREE.Mesh(
			new THREE.SphereBufferGeometry(2, 10, 10),
			material
		);



		this.add(this.actor);
		this.actor.position.y = this.actor.geometry.parameters.radius + 1; // + 1

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.set(5, 5, -10);
		this.camera.lookAt(this.actor.position);


		this.add (this.camera);

		// CREACION DE ANIMACIONES

		// CREACION DE TRANSFORMACIONES ELEMENTALES
		this.actor.rotation.y = Math.PI;
		this.actor.scale.y += 0.5;
		// this.actor.position.y/

	}

	createGUI(gui, titleGui){
		// CREACION DE GUI
		this.guiControls = new function (){
			// variables que queramos toquetear
			this.carril = 0;
		}

		var folder = gui.addFolder(titleGui);
		folder.add(this.guiControls, 'carril', -1, 1, 1).name("Carril: ").listen();
	}

	update(){
		// CREACION DE UPDATES
		this.actor.position.x = -2 * this.guiControls.carril;
		this.actor.rotation.y += 0.01;

	}
};


export { Personaje };
