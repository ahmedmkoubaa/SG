import * as THREE from '../libs/three.module.js';

class Barrido extends THREE.Object3D {
	constructor (gui, titleGui){
		super();
		this.createGUI(gui, titleGui);

		// CREACIO DE OBJETOS
		var forma = new THREE.Shape();
		forma.moveTo(0, 10);
		forma.bezierCurveTo(2,7, 3,4, 0, 0);
		forma.bezierCurveTo(-3,4, -2, 7, 0,10);
		// forma.bezierCurveTo(4, -10, 1, -6, 0,0);

		var points = [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(0, 10, 0),
			new THREE.Vector3(0, 10, -10),
			new THREE.Vector3(0, 0, 10),
			new THREE.Vector3(0, 0, 100)
		];

		var spline = new THREE.CatmullRomCurve3(points);
		var options = {bevelEnabled: false, depth : 1 , steps : 20 , curveSegments : 10, extrudePath: spline};

		var geometry = new THREE.ExtrudeBufferGeometry(forma, options);
		var material = new THREE.MeshPhongMaterial({color: 0x00ffff});
		var mesh = new THREE.Mesh(geometry, material);

		this.add(mesh);

		// CREACION DE TRANSFORMACIONES ELEMENTALES
		mesh.scale.set(0.2, 0.2, 0.2);
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
		this.position.x = this.guiControls.posX;
		this.position.z = this.guiControls.posZ
	}
};


export { Barrido };
