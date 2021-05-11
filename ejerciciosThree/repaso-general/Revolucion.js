import * as THREE from '../libs/three.module.js';

class Revolucion extends THREE.Object3D {
	constructor (gui, titleGui, perfil = []){
		super();
		this.createGUI(gui, titleGui);

		if (perfil.length == 0) {
			// cargar ejemplo de prueba
			perfil = [
				new THREE.Vector3 (1, 0, 0),
				new THREE.Vector3 (2, 1, 0),
				new THREE.Vector3 (2, 2, 0),
				new THREE.Vector3 (2, 3, 0),
				new THREE.Vector3 (1, 4, 0),
				new THREE.Vector3 (1, 5, 0)
			];
		}

		this.revolucion = new THREE.Mesh(
			new THREE.LatheGeometry(perfil),
			new THREE.MeshPhongMaterial({color: 0xff0000})
		);

		this.add(this.revolucion);
	}

	createGUI(gui, titleGui){
		this.guiControls = new function (){
			// variables que queramos toquetear
			this.incrementoRotacion = 0;
			this.posX = 0;
			this.posZ = 0;
		}

		var folder = gui.addFolder(titleGui);
		folder.add(this.guiControls, 'incrementoRotacion', 0, 0.1, 0.01).name("Incrementar rotación: ").listen();
		folder.add(this.guiControls, 'posX', -10, 10, 1).name("Posición en x: ").listen();
		folder.add(this.guiControls, 'posZ', -10, 10, 1).name("Posición en Z: ").listen();
	}

	update(){
		this.rotation.y += this.guiControls.incrementoRotacion;
		this.revolucion.position.x = this.guiControls.posX;
		this.revolucion.position.z = this.guiControls.posZ;
	}
};


export { Revolucion };
