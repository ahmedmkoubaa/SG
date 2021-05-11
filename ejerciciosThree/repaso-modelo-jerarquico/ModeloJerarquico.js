// EXAMEN
import * as THREE from '../libs/three.module.js'

class ModeloJerarquico extends THREE.Object3D {
	constructor(gui, titleGui){
		super();
		this.createGUI(gui, titleGui);

		// Creacion de OBJETOS
		var base = new THREE.Mesh(
			new THREE.BoxGeometry(5, 10, 2),
			new THREE.MeshPhongMaterial({color: 0xff00ff})
		);

		this.brazoIzquierdo = this.createBrazoIzquierdo();
		this.brazoDerecho = this.createBrazoDerecho();


		this.add(base);

		this.add(this.brazoDerecho);
		this.add(this.brazoIzquierdo);


		// creacion de animaciones

		// creacion de TRANSFORMACIONES ELEMENTALES
		base.position.set(0, 5, -1);
		this.brazoDerecho.position.set(-1.5, 5, 0.1);
		this.brazoIzquierdo.position.set(+1.5, 5, 0.1);
	}

	createBrazoIzquierdo(){
		var brazo = new THREE.Object3D();
		var antebrazo = this.createAnteBrazo();
		var mano 	  = this.createMano();

		antebrazo.add(mano);
		brazo.add(antebrazo);

		this.manoIzquierda = mano;

		return brazo;
	}

	createBrazoDerecho(){
		var brazo = new THREE.Object3D();
		var antebrazo = this.createAnteBrazo();
		var mano 	  = this.createMano();

		antebrazo.add(mano);
		brazo.add(antebrazo);

		this.manoDerecha = mano;

		return brazo;
	}

	createAnteBrazo(){
		var antebrazo = new THREE.Object3D();
		var pala = new THREE.Mesh(
			new THREE.BoxGeometry(1, 5, 0.5, 20),
			new THREE.MeshPhongMaterial({color: 0x0000ff})
		);

		pala.position.y = -2.5;
		antebrazo.add(pala);

		var hombro = new THREE.Mesh(
			new THREE.CylinderGeometry(0.5,0.5,0.25),
			new THREE.MeshPhongMaterial({color: 0x111111})
		);

		hombro.rotation.x = 1.57;
		hombro.position.y = -1;
		hombro.position.z = 0.25;

		antebrazo.add(hombro);

		return antebrazo;
	}

	createMano(){
		var mano = new THREE.Mesh(
			new THREE.CylinderGeometry(0.5 , 0.5, 5),
			new THREE.MeshPhongMaterial({color: 0xff0000})
		);

		mano.position.y = -2.5;

		var nodoMano = new THREE.Object3D();
		nodoMano.add(mano);

		nodoMano.rotation.x = -1.5708;
		// nodoMano.position.z = 5;
		nodoMano.position.y = -5;


		return nodoMano;
	}

	createGUI(gui, titleGui) {
		this.guiControls = new function(){
			this.rotar = 0;
			this.extender = 1;
			this.elevar = 0;
		}

		var folder = gui.addFolder(titleGui);
		folder.add (this.guiControls, 'rotar', 0, 1.57, 0.01).name ('Rotar brazos: ').listen();
		folder.add (this.guiControls, 'extender', 1, 2, 0.01).name('Extender brazos: ').listen();
		folder.add (this.guiControls, 'elevar', 0, 3, 0.1).name('Elevar brazos: ').listen();
	}

	update(){
		this.brazoDerecho.position.y = 6 + this.guiControls.elevar;
		this.brazoIzquierdo.position.y = 6 + this.guiControls.elevar;

		this.brazoDerecho.rotation.z = - this.guiControls.rotar;
		this.brazoIzquierdo.rotation.z = this.guiControls.rotar;

		this.manoIzquierda.scale.y = this.guiControls.extender;
		this.manoDerecha.scale.y = this.guiControls.extender;
	}
};


export { ModeloJerarquico };
