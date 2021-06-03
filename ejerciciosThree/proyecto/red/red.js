import * as THREE from '../../../libs/three.module.js'
import * as Constants from '../Constantes.js'


class Red extends THREE.Object3D {
  constructor() {
    super();
    var largo_red = 10;

	 // crear geometrias basicas
    var tuboGeom = new THREE.CylinderBufferGeometry(0.2, 0.2, largo_red, 10, 10);
    var redGeom = new THREE.CylinderBufferGeometry(2, 0.5, 4, 10, 10);
    var anilloGeom = new THREE.TorusGeometry( 2,  0.1,  16,  50 );
    // anilloGeom.translate(0, -largo_red-2, 0);

	 // rotarlas y adaptarlas
    redGeom.rotateX(2*Math.PI/4);
    redGeom.translate(0, 0, -2);
    tuboGeom.translate(0, largo_red/2+2, 0);

	 // crear materiales a nuestro gusto
	 // material para el palo de la red
    var material = Constants.rojo;
    material.flatShading = true;

	 // malla para la cabeza de la red
	 var materialwireframe = Constants.blancowire;

	 // crear los objetos
    var tubo = new THREE.Mesh(tuboGeom, material);
    var anillo = new THREE.Mesh(anilloGeom, material);
    var red = new THREE.Mesh(redGeom, materialwireframe);

	 // aniadir nuestros objetos al general
    // this.add(tubo);
    // this.add(anillo);
    // this.add(red);

	 this.redCompleta = new THREE.Object3D();

	 this.redCompleta.add(tubo);
	 this.redCompleta.add(anillo);
	 this.redCompleta.add(red);

	 this.add(this.redCompleta);

	 // ajustar para tener centro de masas en origen y
	 // red apuntando hacia arriba
	 // this.redCompleta.position.y = 5;
	 // this.redCompleta.rotation.z = Math.PI;

	 // this.rotation.z = Math.PI;

  }

  update () {
  }
}
class RedAbajo extends THREE.Object3D {
  constructor() {
    super();
    var largo_red = 10;
    var tuboGeom = new THREE.CylinderBufferGeometry(0.2, 0.2, largo_red, 10, 10);
    var redGeom = new THREE.CylinderBufferGeometry(2, 0.5, 4, 10, 10);

    // constructor( radius,  tube,  radialSegments,  tubularSegments,  arc )
    var anilloGeom = new THREE.TorusGeometry( 2,  0.1,  16,  50 );
    // anilloGeom.translate(0, -largo_red-2, 0);
    redGeom.rotateX(2*Math.PI/4);
    redGeom.translate(0, 0, -2);

    tuboGeom.translate(0, -largo_red/2-2, 0);
    var material = Constants.rojo;
    var materialwireframe = Constants.blancowire;
    material.flatShading = true;
    var cylinder = new THREE.Mesh(tuboGeom, material);
    var torus = new THREE.Mesh(anilloGeom, material);
    var red = new THREE.Mesh(redGeom, materialwireframe);
    //cylinder.position.y = 5;
    this.add(cylinder);
    this.add(torus);
    this.add(red);

  }

  update () {
  }
}

export { Red };
export {RedAbajo};
