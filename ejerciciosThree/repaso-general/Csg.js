import * as THREE from '../libs/three.module.js';
import { ThreeBSP } from '../libs/ThreeBSP.js'

class Csg extends THREE.Object3D {
	constructor (gui, titleGui){
		super();
		this.createGUI(gui, titleGui);

		var material = new THREE.MeshNormalMaterial({color: 0xff0000, flatShading: true, needsUpdate: true});


		// HERE WE BEGAN TO BUILD OUR CUP

		// We just defined as normal and common THREE Geometries the pieces we gonna use
		var cuerpo = new THREE.CylinderGeometry(1, 1, 5);
		var cabeza = new THREE.CylinderGeometry(2, 2, 0.5);
		var punta = new THREE.CylinderGeometry(0, 0.6, 1);

		var marca1 = new THREE.BoxGeometry(3.5, 1, 0.5);
		var marca2 = new THREE.BoxGeometry(3.5, 1, 0.5);

		var material = new THREE.MeshPhongMaterial({color: 0x00ff00});

		cuerpo.translate(0, 2.7, 0);
		cabeza.translate(0, 0.25, 0);
		punta.translate(0, 5.5, 0);

		var cuerpoBSP = new ThreeBSP(cuerpo);
		var cabezaBSP = new ThreeBSP(cabeza);
		var puntaBSP = new ThreeBSP(punta);

		for (var i = 0; i < 30; i += 1){
			var rosca = new THREE.BoxGeometry(1, 1 , 1);
			rosca.rotateX(0.274533);
			rosca.translate(1, i/4, 0);
			rosca.rotateY(i);

			var bsp = new ThreeBSP(rosca);
			cuerpoBSP = cuerpoBSP.subtract(bsp);
		}

		marca1.rotateY(1.5708/2);
		marca1.translate(0, -0.3, 0);

		marca2.translate(0, -0.3, 0);
		marca2.rotateY(-1.5708/2);


		var marca1BSP = new ThreeBSP(marca1);
		var marca2BSP = new ThreeBSP(marca2);

		cabezaBSP = cabezaBSP.subtract(marca1BSP);
		cabezaBSP = cabezaBSP.subtract(marca2BSP);
		cuerpoBSP = cuerpoBSP.union(cabezaBSP);

		var tornillo = cuerpoBSP.union(puntaBSP);
		var geometry = tornillo.toGeometry();
		var bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
		var final = new THREE.Mesh(bufferGeometry, material);


		final.rotation.x = 3.141516;
		final.position.y = 6;

		// Finally added to the object
		this.add(final);


		this.position.z = 5;
	}

	createGUI(gui, titleGui){
		this.guiControls = new function (){
			// variables que queramos toquetear
			this.incrementoRotacion = 0;
			this.posX = 5;
			this.posZ = 5;
		}

		var folder = gui.addFolder(titleGui);
		folder.add(this.guiControls, 'incrementoRotacion', 0, 0.1, 0.01).name("Velocidad rotación: ").listen();
		folder.add(this.guiControls, 'posX', -10, 10, 1).name("Posición en x: ").listen();
		folder.add(this.guiControls, 'posZ', -10, 10, 1).name("Posición en Z: ").listen();
	}

	update(){
		this.rotation.y += this.guiControls.incrementoRotacion;
		this.position.x = this.guiControls.posX;
		this.position.z = this.guiControls.posZ
	}
};


export { Csg };
