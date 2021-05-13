import * as THREE from '../libs/three.module.js';
import { MyLoadedModel } from './MyLoadedModel.js'

class Personaje extends THREE.Object3D {
	constructor (gui, titleGui){
		super();
		this.createGUI(gui, titleGui);

		// CREACION DE OBJETOS
		var texture = new THREE.TextureLoader().load('../imgs/cara.jpg');
		var material = new THREE.MeshNormalMaterial ({color: 0xff0000});

		this.actor = new THREE.Mesh(
			new THREE.SphereBufferGeometry(2, 20, 20),
			material
		);

		// this.actor = new MyLoadedModel('../models/pez/fish.mtl','../models/pez/fish.obj' );
		this.add(this.actor);
		// this.actor.position.y = this.actor.geometry.parameters.radius + 1; // + 1

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.set(0, 5, -15);

		var pos = new THREE.Vector3().copy( this.actor.position);
		// pos.y += this.actor.geometry.parameters.radius;
		pos.z += 10;

		this.camera.lookAt(pos);

		this.add (this.camera);

		// CREACION DE ANIMACIONES

		// CREACION DE TRANSFORMACIONES ELEMENTALES
		this.actor.rotation.y = Math.PI;

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
		this.actor.position.x = -5 * this.guiControls.carril;

	}
};


export { Personaje };
