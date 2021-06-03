import * as THREE from '../libs/three.module.js';
// import { MyLoadedModel } from './MyLoadedModel.js'
import {Pez} from './pez/Pez.js'
// import * as Constants from './Constantes.js'

class Personaje extends THREE.Object3D {
	constructor (vidas = 1, maxDesplzamiento){
		super();

		// CREACION DE OBJETOS
		this.createActor();
		this.createCameras();

		this.vidas = vidas;
		this.maxDesplzamiento = maxDesplzamiento;


		// CREACION DE TRANSFORMACIONES ELEMENTALES
		this.actor.rotation.y = Math.PI;

		this.luz = new THREE.SpotLight( {color: 0xffffff, intensity: 0.1 } );
		this.luz.target = this.actor;
		this.luz.position.set(0, 0, -0.1);
		this.add(this.luz );

		this.sol=new THREE.SpotLight( {color: 0x000000, intensity: 0.05 } );
		this.sol.target=this.actor;
		this.sol.position.set(0,600,60);
		this.add(this.sol);
	}

	createCameras() {
		this.camaras = [];

		/////////////////////////////////////////////////////////////////////////////////////////////////////
		// priemra camara, sigue desde atras con un angulo un poco elevado al actor
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.set(0, 5, -15);

		var pos = new THREE.Vector3().copy( this.actor.position );
		pos.z += 10;
		this.camera.lookAt(pos);

		this.add (this.camera);
		this.camaras.push(this.camera);

		/////////////////////////////////////////////////////////////////////////////////////////////////////
		// una camara en primera persona, como si tuviesemos los ojos del personaje
		this.camera2 = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

		this.camera2.position.set(0, 0, 5);
		this.camera2.lookAt(0, 0, 10);

		this.add(this.camera2);
		this.camaras.push(this.camera2);

		/////////////////////////////////////////////////////////////////////////////////////////////////////
		// como si estuviesemos viendo desde el hombro del actor, en diagonal con el
		this.camera3 = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera3.position.set(-2, 2, -10);

		var posActor = this.actor.position;
		this.camera3.lookAt(posActor.x, posActor.y, posActor.z);

		this.add(this.camera3);
		this.camaras.push(this.camera3);

		/////////////////////////////////////////////////////////////////////////////////////////////////////
		this.siguienteCamera = 0;
	}

	getCamera() {
		return this.camaras[this.siguienteCamera];
	}

	cambiarCamara() {
		this.siguienteCamera++;
		this.siguienteCamera %= this.camaras.length;

		return this.camaras[this.camarActual];
	}

	// crea y añade el actor
	createActor(){
		// var texture = new THREE.TextureLoader().load('../imgs/cara.jpg');
		// var material = new THREE.MeshNormalMaterial ({color: 0xff0000});
		//
		// this.actor = new THREE.Mesh(
		// 	new THREE.SphereBufferGeometry(2, 20, 20),
		// 	material
		// );
		this.actor=new Pez();
		this.add(this.actor);
	}

	goUp(){
		if ( this.actor.position.y < this.maxDesplzamiento ){

			this.actor.saltar(this.actor.position.y,this.actor.position.y + 5);
			this.actor.position.y += 5;
			this.luz.position.y += 5;
			this.camera2.position.y += 5;
		}
	}

	goDown() {
		if ( this.actor.position.y > -this.maxDesplzamiento ){
			this.actor.goDown(this.actor.position.y,this.actor.position.y - 5);
			this.actor.position.y -= 5;
			this.luz.position.y -= 5;
			this.camera2.position.y -= 5;
		}

	}

	goLeft() {
		if ( this.actor.position.x < this.maxDesplzamiento ){
			this.actor.girarIzquierda(0,0);
			this.actor.position.x += 5;
			this.luz.position.x += 5;
			this.camera2.position.x += 5;

		}
	}

	goRight() {
		if ( this.actor.position.x > -this.maxDesplzamiento ){
			this.actor.girarDerecha(0,0);
			this.actor.position.x -= 5;
			this.luz.position.x -= 5;
			this.camera2.position.x -= 5;
		}
	}

	update(){
		// CREACION DE UPDATES
		this.actor.update();
	}
};


export { Personaje };
