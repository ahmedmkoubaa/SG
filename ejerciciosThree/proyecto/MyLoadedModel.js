import * as THREE from '../libs/three.module.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'

class MyLoadedModel extends THREE.Object3D {
	constructor(rutaMtl, rutaObj){
		super();

		// createGui(gui, titleGui);
		var that = this;								// Nos quedamos con la referencia a este objeto
		var materialLoader = new MTLLoader();	// Definimos el cargador de material
		var objectLoader = new OBJLoader();		// Definimos el cargador de la geometría del objeto

		// this.modeloOriginal;
		// Partiendo del cargador del material, vamos a cargar el resto
		materialLoader.load(rutaMtl,
			function(materials) {
				objectLoader.setMaterials(materials);
				objectLoader.load(
					rutaObj,
					function(object) {
						var modelo = object;
						that.add (modelo);
						modelo.rotation.y = 3.141597;
					},
					null,
					null);
			});

		// Elevar un poco para que el objeto aparezca justo encima del suelo
		this.position.set(0, 0.6, 0);

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.set(0, 2, -6);
		this.camera.lookAt(0, 0, 0);


		this.add (this.camera);

		// this.modeloOriginal.material = new THREE.MeshNormalMaterial({color: 0x0000ff});
		// this.modeloOriginal.material.needsUpdate = true;
	}

	update(){

	}
}

export { MyLoadedModel };
