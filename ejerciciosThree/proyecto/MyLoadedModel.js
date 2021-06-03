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

		// Partiendo del cargador del material, vamos a cargar el resto
		materialLoader.load(rutaMtl,
			function(materials) {
				objectLoader.setMaterials(materials);
				objectLoader.load(
					rutaObj,
					function(object) {
						var modelo = object;
						that.add (modelo);
					},
					null,
					null);
		});

	}

	update(){

	}
}

export { MyLoadedModel };
