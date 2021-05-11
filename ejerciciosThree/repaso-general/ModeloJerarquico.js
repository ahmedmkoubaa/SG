import * as THREE from '../libs/three.module.js';

class ModeloJerarquico extends THREE.Object3D {
	constructor (gui, titleGui){
		super();
		this.createGUI(gui, titleGui);

		this.soporte = this.createSoporte();
		this.add(this.soporte);

		this.brazo = this.createBrazo();

		this.brazo.position.y = 5;
		this.add(this.brazo);

	}

	createSoporte(){
		var soporte = new THREE.Object3D();

		var pie = new THREE.Mesh(
			new THREE.CylinderBufferGeometry(0.5, 0.5, 5),
			new THREE.MeshPhongMaterial({color: 0x0000ff})
		);

		var base = new THREE.Mesh(
			new THREE.CylinderBufferGeometry(1.5, 1.5, 0.2, 15),
			new THREE.MeshPhongMaterial({color: 0x0000ff})
		);

		pie.position.y  = pie.geometry.parameters.height/2;
		base.position.y = base.geometry.parameters.height/2;

		soporte.add(pie);
		soporte.add(base);

		return soporte;
	}

	createBrazo(){
		var nodoBrazo = new THREE.Object3D();
		var brazo = new THREE.Mesh(
			new THREE.BoxBufferGeometry(8, 1, 1),
			new THREE.MeshPhongMaterial({color: 0x000080})
		);

		brazo.position.y = brazo.geometry.parameters.height/2;
		brazo.position.x = +2.5;

		this.nodoGancho = this.createGancho();
		this.nodoGancho.position.x = +3;

		nodoBrazo.add(brazo);
		nodoBrazo.add(this.nodoGancho);

		return nodoBrazo;
	}

	createGancho(){
		var nodoGancho = new THREE.Object3D();
		this.nodoCuerda = new THREE.Object3D();
		this.enganche = new THREE.Object3D();

		this.longitudCuerda = 3;

		var cuerda = new THREE.Mesh(
			new THREE.CylinderBufferGeometry(0.15, 0.15, this.longitudCuerda),
			new THREE.MeshPhongMaterial({color: 0xff00000})
		);

		cuerda.position.y = -cuerda.geometry.parameters.height/2;
		this.nodoCuerda.add(cuerda);

		var engancheMesh =  new THREE.Mesh(
			new THREE.CylinderBufferGeometry(0.35, 0.35, 0.25),
			new THREE.MeshPhongMaterial({color: 0xff00000})
		);

		engancheMesh.position.y = -engancheMesh.geometry.parameters.height/2;

		this.enganche.add(engancheMesh);
		nodoGancho.add(this.nodoCuerda);
		nodoGancho.add(this.enganche);

		return nodoGancho;
	}

	createGUI(gui, titleGui){
		this.guiControls = new function (){
			// variables que queramos toquetear
			this.incrementoRotacion = 0;
			this.posX = 0;
			this.posZ = 0;
			this.posY = 0;

			this.rotacionBrazo = 0;
			this.desplazarGancho = 1.5;
			this.extenderGancho = 1;
		}

		var folder = gui.addFolder(titleGui);
		folder.add(this.guiControls, 'incrementoRotacion', 0, 0.1, 0.01).name("Velocidad rotación: ").listen();
		folder.add(this.guiControls, 'posX', -10, 10, 1).name("Posición en x: ").listen();
		folder.add(this.guiControls, 'posZ', -10, 10, 1).name("Posición en Z: ").listen();
		folder.add(this.guiControls, 'posY', -10, 10, 1).name("Posición en Y: ").listen();

		folder.add(this.guiControls, 'rotacionBrazo', 0, 6.28319, 0.005).name("Rotar brazo: ").listen();
		folder.add(this.guiControls, 'desplazarGancho', 1.5, 6, 0.01).name("Mover gancho: ").listen();
		folder.add(this.guiControls, 'extenderGancho', 0.5, 1.5, 0.1).name("Extender gancho: ").listen();
	}

	update(){
		this.rotation.y += this.guiControls.incrementoRotacion;
		this.position.x = this.guiControls.posX;
		this.position.z = this.guiControls.posZ;
		this.position.y = this.guiControls.posY;

		this.brazo.rotation.y = this.guiControls.rotacionBrazo;
		this.nodoGancho.position.x = this.guiControls.desplazarGancho;
		this.nodoCuerda.scale.y = this.guiControls.extenderGancho;
		this.enganche.position.y = -this.longitudCuerda * this.guiControls.extenderGancho;

		// this.guiControls.rotacionBrazo = this.guiControls.rotacionBrazo % 6.2

	}
};


export { ModeloJerarquico };
