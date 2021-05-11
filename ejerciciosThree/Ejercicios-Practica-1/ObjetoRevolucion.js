import * as THREE from '../libs/three.module.js'

class ObjetoRevolucion extends THREE.Object3D {
	constructor(gui, titlegui, perfil = []){
		super();

		// crear geometria
		var geometry = new THREE.LatheGeometry(perfil);
		var material = new THREE.MeshNormalMaterial({color: 0xff0000, flatShading: true});
		var objRevol = new THREE.Mesh(geometry, material);

		this.add(objRevol);
		this.scale.set(0.2, 0.2, 0.2);

		// latheObject = new THREE.Mesh (new THREE.LatheGeometry (points, ...), unMaterial);
		// Para crear una línea visible, como en el vídeo
		// lineGeometry = new THREE.Geometry();
		// lineGeometry.vertices = points;
		// line = new THREE.Line (lineGeometry, unMaterial);
	}

	update (){
		// aqui luego pondre cosas
		this.rotation.y -= 0.1;
	}

	createGui (gui, titleGui){
		// aqui faltan cosas por poner para mas tarde
		// TRABAJADOR ES LA CLASE PADRE
		// Y AQUELLOS QUE ESTAN DEBAJO SON HIJOS
		// PORQUE SE PARECEN MUCHO, PERO NO SON IGUALES.
		// UN PANADERO Y UN MEDICO SON TRABAJADORES
		// AMBOS TIENEN UN SUELDO, UNA FORMACION, UN NUMERO DE HORAS TRABAJADAS
		// LO ENTIENDES?
		// PERO NO SON IGUALES.
		// LO MISMO PASA CON DOCTOR, UN DOCTOR PUEDE SER UN MEDICO, UN CIENTIFICO,
		// UN INGENIERO, SON PARECIDOS PERO TIENEN DIFERENCIAS
		//
	}
}

export { ObjetoRevolucion };
