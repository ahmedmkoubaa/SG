import * as THREE from '../libs/three.module.js'

class Barrido extends THREE.Object3D {
	constructor(gui, titleGui){
		super();

		const x = 0, y = 0;

		var heartShape = new THREE.Shape();

		heartShape.moveTo( x + 5, y + 5 );
		heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
		heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
		heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
		heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
		heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
		heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );


		var pts = [
			new THREE.Vector3(0,0,0),
			new THREE.Vector3(0,40,0),
			new THREE.Vector3(0,40,40),
			new THREE.Vector3(40,40,30),
			new THREE.Vector3(40,40,0),
			new THREE.Vector3(40,80,0),
			new THREE.Vector3(40, 80, 40)
		];

		var path = new THREE.CatmullRomCurve3(pts);
		var options = {bevelEnabled: false, depth : 1 , steps : 35 , curveSegments : 10, extrudePath: path};

		var geometry = new THREE.ExtrudeBufferGeometry(heartShape, options);
		var material = new THREE.MeshNormalMaterial( { color: 0xf10012 } );
		var mesh = new THREE.Mesh( geometry, material ) ;

		this.add( mesh );

		mesh.position.y = -1;
		mesh.scale.set(0.05, 0.05, 0.05);
		mesh.rotation.set(3.14159, 3.14159, 3.14159);
	}

	update (){
		// mas tarde pondre cosas
		// this.rotation.y += 0.1;
	}
}

export { Barrido };
