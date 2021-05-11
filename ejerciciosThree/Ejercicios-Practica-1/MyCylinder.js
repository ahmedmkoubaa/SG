import * as THREE from '../libs/three.module.js'

class MyCylinder extends THREE.Object3D {
	constructor(gui, titleGui){
		super();

		// this.createGui(GUI, titleGui);
		var geometry = new THREE.CylinderGeometry(0.5 , 0.5, 1, 10, 10);
		var material = new THREE.MeshNormalMaterial({color: 0xff0000, flatShading: true});
		material.needsUpdate = true;
		var cilindro = new THREE.Mesh(geometry, material);

		this.add(cilindro);

		cilindro.position.y = 0.5;
	}

	update (){
		this.rotation.y += 0.1;
	}

	createGui(gui, titleGui){
		// aqui aun no hay nada
	}
}

export { MyCylinder };
