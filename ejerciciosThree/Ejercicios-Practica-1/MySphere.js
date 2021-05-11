import * as THREE from '../libs/three.module.js'

class MySphere extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();		// llamar a super, esto es como un java no? que se crease todo lo heredado

		// Vamos a crear primero la interfaz de usuario porque la usaran otros metodos
		// this.createGUI(gui, titleGui);

		// Vamos a crear ahora la geometría del objeto
		var sphGeom = new THREE.SphereGeometry(0.5, 10, 10);
		var sphMat = new THREE.MeshNormalMaterial({color: 0xff0000, flatShading: true});
		sphMat.needsUpdate = true;

		var sphere = new THREE.Mesh(sphGeom, sphMat);
		this.add(sphere);

    	sphere.position.y = 0.5;
	}

	update () {
		// aqui no hace falta nada por ahora
		this.rotation.y += 0.1;
	}

	createGUI (gui, guiControls) {
		// aqui tampoco hace falta nada por ahora
	}
}

export { MySphere };
