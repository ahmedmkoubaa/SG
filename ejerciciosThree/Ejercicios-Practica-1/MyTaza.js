import * as THREE from '../libs/three.module.js'
import { ThreeBSP } from '../libs/ThreeBSP.js'


class MyTaza extends THREE.Object3D {
	constructor(gui, titleGui){
			// constructor(height: 1, width:1, handleSize:1 , gui, guiControls){
		super();

		// this.createGui(GUI, titleGui);

		// we defined here a common material
		var material = new THREE.MeshNormalMaterial({color: 0xff0000, flatShading: true});
		material.needsUpdate = true;


		// HERE WE BEGAN TO BUILD OUR CUP

		// We just defined as normal and common THREE Geometries the pieces we gonna use
		var exterior = new THREE.CylinderGeometry(0.5 , 0.5,  1);
		var interior = new THREE.CylinderGeometry(0.4 , 0.4, 1);
		var handle   = new THREE.TorusGeometry   (0.4, 0.1);

		// We put in the correct place our pieces
		interior.translate(0, 0.1, 0);
		handle.translate  (0.5, 0, 0);


		// We built here the ThreeBSP version of aur pieces
		var exteriorBSP = new ThreeBSP(exterior);
		var interiorBSP = new ThreeBSP(interior);
		var handleBSP   = new ThreeBSP(handle);

		// We operated our pieces using the union, subtract and intersection operationes
		var exteriorWithHandle = exteriorBSP.union(handleBSP);
		var cup = exteriorWithHandle.subtract(interiorBSP);

		var geometryCup = cup.toGeometry();
		var bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometryCup);
		var finalCup = new THREE.Mesh(bufferGeometry, material);

		this.add(finalCup);

	}

	update (){
		this.rotation.y += 0.01;
	}

	createGui(gui, titleGui){
		// aqui aun no hay nada
	}
}

// class MyTaza extends THREE.Object3D {
//   constructor(gui,titleGui) {
//     super();
//
//     // Se crea la parte de la interfaz que corresponde a la caja
//     // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
//     // this.createGUI(gui,titleGui);
//
// 	 var exterior = new THREE.CylinderGeometry(0.5 , 0.5, 1);
// 	 var interior = new THREE.CylinderGeometry(0.4 , 0.4, 0.9);
// 	 var asa = new THREE.TorusGeometry(0.1, 0.1);
//
// 	 var material = new THREE.MeshPhongMaterial({color: 0xff0000});
//
// 	 var mesh1 = new THREE.Mesh(material, exterior);
// 	 var mesh2 = new THREE.Mesh(material, interior);
// 	 var mesh3 = new THREE.Mesh(material, asa);
//
// 	 this.add(mesh1);
// 	 this.add(mesh2);
// 	 this.add(mesh3);
//   }
//
//   createGUI (gui,titleGui) {
//
//   }
//
//   update () {
//
//   }
// }
//
export { MyTaza };
