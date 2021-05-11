import * as THREE from '../libs/three.module.js'
import { ThreeBSP } from '../libs/ThreeBSP.js'


class MyVessel extends THREE.Object3D {
	constructor(gui, titleGui){
			// constructor(height: 1, width:1, handleSize:1 , gui, guiControls){
		super();

		// this.createGui(GUI, titleGui);

		// we defined here a common material
		var material = new THREE.MeshNormalMaterial({color: 0xff0000, flatShading: true});
		material.needsUpdate = true;


		// HERE WE BEGAN TO BUILD OUR CUP

		// We just defined as normal and common THREE Geometries the pieces we gonna use
		// var exterior = new THREE.CylinderGeometry(0.5 , 0.5,  1);
		// var interior = new THREE.CylinderGeometry(0.4 , 0.4, 1);
		// var handle   = new THREE.TorusGeometry   (0.4, 0.1);


		var extSphere = new THREE.SphereGeometry(0.5);
		var intSphere = new THREE.SphereGeometry(0.4);
		var extMouth  = new THREE.CylinderGeometry(0.2, 0.3, 1);
		var intMouth  = new THREE.CylinderGeometry(0.15, 0.25, 1.2);

		// We put in the correct place our pieces
		// interior.translate(0, 0.1, 0);
		// handle.translate  (0.5, 0, 0);


		// We built here the ThreeBSP version of aur pieces
		// var exteriorBSP = new ThreeBSP(exterior);
		// var interiorBSP = new ThreeBSP(interior);
		// var handleBSP   = new ThreeBSP(handle);



		// We operated our pieces using the union, subtract and intersection operationes
		// var exteriorWithHandle = exteriorBSP.union(handleBSP);
		// var cup = exteriorWithHandle.subtract(interiorBSP);

		extSphere.translate(0, 0.5, 0);
		intSphere.translate(0, 0.6, 0);

		extMouth.translate(0, 1.2, 0);
		intMouth.translate(0, 1.2, 0);

		var extSphereBSP = new ThreeBSP(extSphere);
		var intSphereBSP = new ThreeBSP(intSphere);
		var extMouthBSP  = new ThreeBSP(extMouth);
		var intMouthBSP  = new ThreeBSP(intMouth);

		var mouthPartial = extMouthBSP.subtract(intMouthBSP);
		var spherePartial = extSphereBSP.subtract(intSphereBSP);
		var finalVessel = spherePartial.union(mouthPartial);

		// spherePartial.translate(0, 0.5, 0);
		// mouthPartial.translate(0, 1.5, 0);



		var geometryVessel = finalVessel.toGeometry();
		var bufferGeometryFinal = new THREE.BufferGeometry().fromGeometry(geometryVessel);

		// var geometryMouth = mouthPartial.toGeometry();
		// var geometrySphere = spherePartial.toGeometry();

		// var bufferGeometryMouth = new THREE.BufferGeometry().fromGeometry(geometryMouth);
		// var bufferGeometrySphere = new THREE.BufferGeometry().fromGeometry(geometrySphere);

		// var finalMouth = new THREE.Mesh(bufferGeometryMouth, material);
		// var finalSphere = new THREE.Mesh(bufferGeometrySphere, material);
		var finalVesselMesh = new THREE.Mesh(bufferGeometryFinal, material);

		// var geometryCup = cup.toGeometry();
		// var bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometryCup);
		// var finalCup = new THREE.Mesh(bufferGeometry, material);
		//
		// this.add(finalCup);
		//
		//
		// this.add(finalMouth);
		// this.add(finalSphere);

		this.add(finalVesselMesh);

		// console.log(this);

	}

	update (){
		this.rotation.y += 0.01;
	}

	createGui(gui, titleGui){
		// aqui aun no hay nada
	}
}

export { MyVessel };
