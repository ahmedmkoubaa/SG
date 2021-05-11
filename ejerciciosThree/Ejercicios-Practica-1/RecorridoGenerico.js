import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class RecorridoGenerico extends THREE.Object3D {
	constructor (objeto, camino){
		super();
		// this.objeto = new THREE.Object3D();
		// this.spline = new THREE.CatmullRomCurve3();
		//
		// this.objeto.copy(objeto);
		// this.spline.copy(camino);

		// this.objeto = objeto.clone()
		// this.spline = camino.clone();

		this.objeto = objeto;
		this.spline = camino;


		var origen1  = {x: 0.0};
		var destino1 = {x: 0.5};

		var movimiento1 = new TWEEN.Tween(origen1).to(destino1, 4000);

		this.add(this.objeto);

		var that = this;
		movimiento1.onUpdate(function() {
			that.actualizaAnimacion(that.objeto, origen1.x);
		});

		var origen2 = {x: 0.5};
		var destino2 = {x: 1.0};

		var movimiento2 = new TWEEN.Tween(origen2).to(destino2, 2000);
		movimiento2.onUpdate(function() {
			that.actualizaAnimacion(that.objeto, origen2.x);
		});


		movimiento1.chain(movimiento2);
		movimiento2.chain(movimiento1);

		const infinity = 1/0;
		movimiento1.easing(TWEEN.Easing.Quadratic.InOut).onComplete(function(){ origen1.x = 0.0; });
		movimiento2.easing(TWEEN.Easing.Linear.None).onComplete(function(){ origen2.x = 0.0; });

		movimiento1.start();
		
		var linea = new THREE.Geometry();
		linea.vertices = this.spline.getPoints(100);
		var material = new THREE.LineBasicMaterial({color: 0x000000});
		var visibleSpline = new THREE.Line(linea, material);

		this.add(visibleSpline);
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

export { RecorridoGenerico };
