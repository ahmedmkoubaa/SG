import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'


class MiRecorrido extends THREE.Object3D {
	constructor(gui, titleGui){
		super();
		// this.createGUI(gui, titleGui);

		var cono = new THREE.Mesh(
			new THREE.ConeGeometry(1, 3),
			new THREE.MeshPhongMaterial({color: 0xFF0000}));

		// cono.position.y = -1.5;

		this.objeto = new THREE.Object3D();
		this.objeto.add(cono);
		this.add(this.objeto);

		this.spline = new THREE.CatmullRomCurve3([
			new THREE.Vector3( 0, 0, 0),
			new THREE.Vector3( 5, 1, 5),
			new THREE.Vector3( 5, 2,-5),
			new THREE.Vector3( 0, 1, 0),
			new THREE.Vector3(-5, -1, 5),
			new THREE.Vector3(-5, -3,-5),
			new THREE.Vector3( 0, 0, 0)
		]);


		var origen1  = {x: 0.0};
		var destino1 = {x: 0.5};

		var movimiento1 = new TWEEN.Tween(origen1).to(destino1, 8000);

		var that = this;
		movimiento1.onUpdate(function() {
			that.actualizaAnimacion(that.objeto, origen1.x);
		});

		var origen2 = {x: 0.5};
		var destino2 = {x: 1.0};

		var movimiento2 = new TWEEN.Tween(origen2).to(destino2, 4000);
		movimiento2.onUpdate(function() {
			that.actualizaAnimacion(that.objeto, origen2.x);
		});


		movimiento1.chain(movimiento2);
		movimiento2.chain(movimiento1);

		const infinity = 1/0;
		movimiento1.easing(TWEEN.Easing.Cubic.InOut).onComplete(function(){ origen1.x = 0.0; });
		movimiento2.easing(TWEEN.Easing.Cubic.InOut).onComplete(function(){ origen2.x = 0.0; });

		movimiento1.start();

		var linea = new THREE.Geometry();
		linea.vertices = this.spline.getPoints(100);
		var material = new THREE.LineBasicMaterial({color: 0x000000});
		var visibleSpline = new THREE.Line(linea, material);

		this.add(visibleSpline);
	}

	getSpline(){
		return this.spline;
	}

	update(){
		TWEEN.update();
	}

	actualizaAnimacion(objeto, t){
		var posicion = this.spline.getPointAt(t);
		objeto.position.copy(posicion);

		var tangente = this.spline.getTangentAt(t);
		posicion.add(tangente);

		objeto.lookAt(posicion);
	}
};

export { MiRecorrido };
