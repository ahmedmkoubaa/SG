import * as THREE from '../libs/three.module.js';
import { ThreeBSP } from '../libs/ThreeBSP.js'

class Comecoco extends THREE.Object3D {
	constructor (gui, titleGui){
		super();
		this.createGUI(gui, titleGui);

		// CREACION DE OBJETOS
		this.cabeza = this.createCabeza();
		this.add(this.cabeza);

		// CREACION DE ANIMACIONES
		// Definimos variables necesarias y suficientes para la animación de la boca
		this.incremento 		= 0.1;
		this.decrementando 	= false;
		this.minCierreBoca 	= 0.1;
		this.maxAperturaBoca = 0.7;

		// CREACION DE TRANSFORMACIONES ELEMENTALES
		// this.cabeza.position.y = 3; // si se desea ver la cabeza sobre el eje x/z
	}

	createCabeza() {
		var cabeza = new THREE.Object3D();
		// Usamos dos métodos uno para cada parte ya que podríamos querer
		// estas dos partes totalmente diferentes
		var parteArriba = this.createCabezaArriba();
		this.mandibula = this.createParteAbajo();

		cabeza.add(parteArriba);
		cabeza.add(this.mandibula);

		return cabeza;

	}

	createCabezaArriba() {
		// Aquí creamos la parte de arriba de la cabeza del comecocos

		// Material de color generico, podría ser de cualquier color, es amarillo
		var material = new THREE.MeshPhongMaterial({color: 0xffff00});

		// geometrias necesarias
		var cabeza = new THREE.SphereGeometry(3, 15, 15);
		var caja = new THREE.BoxGeometry(6, 6, 6);
		var ojos = new THREE.CylinderGeometry(0.2, 0.2, 8);

		// Posicionarlas adecuadamente
		ojos.rotateZ(1.5708);
		ojos.translate(0, 1.5, 1.5);

		cabeza.translate(0, 0, 0);
		caja.translate(0, -3, 0);

		// Generar BSPs para poder operar cone ellos
		var cabezaBSP = new ThreeBSP(cabeza);
		var cajaBSP = new ThreeBSP(caja);
		var ojosBSP = new ThreeBSP(ojos);

		// Operar con BSPs
		cabezaBSP = cabezaBSP.subtract(cajaBSP);
		cabezaBSP = cabezaBSP.subtract(ojosBSP);

		// Procesar resultado y pasarlo a geometría normal
		var geometry = cabezaBSP.toGeometry();
		var bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
		var final = new THREE.Mesh(bufferGeometry, material);

		// devolver resultado final
		return final;
	}

	createParteAbajo(){
		// Aquí creamos la mandibula de la cabeza del comecocos

		// Material de color generico, podría ser de cualquier color, es amarillo
		var material = new THREE.MeshPhongMaterial({color: 0xffff00});

		// geometrias necesarias
		var cabeza = new THREE.SphereGeometry(3, 15, 15);
		var caja = new THREE.BoxGeometry(6, 6, 6);

		// Posicionarlas adecuadamente
		cabeza.translate(0, 0, 0);
		caja.translate(0, 3, 0);

		// Operar con BSPs
		var cabezaBSP = new ThreeBSP(cabeza);
		var cajaBSP = new ThreeBSP(caja);

		// Operar
		cabezaBSP = cabezaBSP.subtract(cajaBSP);

		// Procesar resultado y pasarlo a geometría norma
		var geometry = cabezaBSP.toGeometry();
		var bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
		var final = new THREE.Mesh(bufferGeometry, material);

		// Devolver resultados finales
		return final;
	}

	createGUI(gui, titleGui){
		// CREACION DE GUI
		this.guiControls = new function (){
			// variables que queramos toquetear
			this.posX = 0;
			this.posZ = 0;
			this.posY = 0;
		}

		var folder = gui.addFolder(titleGui);

		// Controles básicos
		folder.add(this.guiControls, 'posX', -10, 10, 1).name("Posición en x: ").listen();
		folder.add(this.guiControls, 'posZ', -10, 10, 1).name("Posición en Z: ").listen();
		folder.add(this.guiControls, 'posY', -10, 10, 1).name("Posición en Y: ").listen();
	}

	update(){
		// CREACION DE UPDATES

		this.position.x = this.guiControls.posX;
		this.position.z = this.guiControls.posZ;
		this.position.y = this.guiControls.posY;

		this.mandibula.rotation.x += this.incremento;
		if (!this.decrementando && this.mandibula.rotation.x  > this.maxAperturaBoca) {
			this.incremento *= -1;
			this.decrementando = true;
		}

		if (this.mandibula.rotation.x < this.minCierreBoca && this.decrementando){
			this.incremento *= -1;
			this.decrementando = false;
		}

	}
};


export { Comecoco };
