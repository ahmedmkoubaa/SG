import * as THREE from '../libs/three.module.js';
// Clases de mi proyecto
import { Comecoco } from './Comecoco.js'

class Examen extends THREE.Object3D {
	constructor (gui, titleGui){
		super();
		// this.createGUI(gui, titleGui);

		// CREACION DE OBJETOS
		this.comecoco = new Comecoco(gui, "Controles del examen");
		this.add(this.examen);

		// CREACION DE ANIMACIONES

		// CREACION DE TRANSFORMACIONES ELEMENTALES


	}



	update(){
		// CREACION DE UPDATES


		this.comecoco.update();

	}
};


export { Examen };
