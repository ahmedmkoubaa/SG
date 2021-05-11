import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class Camino extends THREE.Object3D {
	constructor (gui, titleGui, puntos = 10, longitud = 10){
		super();
		this.createGUI(gui, titleGui);

		// this.spline = this.generarRecorridoSimple(max);
		this.spline = this.generarRecorridoAleatorio(puntos, longitud);

		var forma = new THREE.Shape();

		forma.moveTo(0, 2);
		// forma.bezierCurveTo( +1, +1, -1, +1, -1, -1 );
		forma.lineTo(0.2, 2);
		forma.lineTo(0.2, -2);
		forma.lineTo(0, -2);

		// var heartShape = new THREE.Shape();
		// var x = 0; var y = 0;
		//
		// heartShape.moveTo( x + 5/5, y + 1/5 );
		// heartShape.bezierCurveTo( x + 5/5, y + 5/5, x + 4/5, y, x, y );
		// heartShape.bezierCurveTo( x - 6/5, y, x - 6/5, y + 7/5,x - 6/5, y + 7/5 );
		// heartShape.bezierCurveTo( x - 6/5, y + 11/5, x - 3/5, y + 15.4/5, x + 5/5, y + 19/5 );
		// heartShape.bezierCurveTo( x + 12/5, y + 15.4/5, x + 16/5, y + 11/5, x + 16/5, y + 7/5 );
		// heartShape.bezierCurveTo( x + 16/5, y + 7/5, x + 16/5, y, x + 10/5, y );
		// heartShape.bezierCurveTo( x + 7/5, y, x + 5/5, y + 5/5, x + 5/5, y + 5/5 );

		var options = {bevelEnabled: false, depth : 1 , steps : puntos * puntos , curveSegments : 5, extrudePath: this.spline};

		var geometry = new THREE.ExtrudeBufferGeometry(forma, options);
		var material = new THREE.MeshNormalMaterial( { color: 0xf10012 } );
		var caminoConForma = new THREE.Mesh( geometry, material ) ;

		var linea = new THREE.Geometry();
		linea.vertices = this.spline.getPoints(100);
		var material = new THREE.LineBasicMaterial({color: 0xff0000});
		var visibleSpline = new THREE.Line(linea, material);

		this.add(visibleSpline);
		this.add( caminoConForma );
	}

	getSpline(){
		return this.spline;
	}

	generarRecorridoSimple(max){
		var ptsSpline = [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(0, max, 0),
			new THREE.Vector3(max, max, 0),
			new THREE.Vector3(max, 0, 0),
			new THREE.Vector3(0, 0, 0)
		];

		return (new THREE.CatmullRomCurve3(ptsSpline));
	}

	rotaciones(){
		// eye(Y) =  cos(angulo(X)) * pos(Y) - sin(angulo(X)) * pos(Z);
		// eye(Z) =  sin(angulo(X)) * pos(Y) + cos(angulo(X)) * pos(Z);
		// eye(X) =  cos(angulo(Y)) * pos(X) + sin(angulo(Y)) * pos(Z);
	}

	generarRecorridoAleatorio(puntos = 10, longitud = 10) {
		var ptsSpline = [];
		var numeroGenerarPuntos = puntos;
		var maxLongitud = longitud;
		var maxAngulo = Math.PI * 2; // son radines

		var origen = {x: longitud, y: longitud, z: longitud};
		var anterior = origen;

		for (var i = 0; i < numeroGenerarPuntos; i++) {
		   var x = anterior.x;
		   var y = anterior.y;
		   var z = anterior.z;


			var nuevoAngulo = -maxAngulo + 2*Math.random() * maxAngulo;
		   var nuevaLongitud = Math.random() * maxLongitud;

			switch (i%3) {
				case 0: x = Math.cos(nuevoAngulo) * anterior.x + Math.sin(nuevoAngulo) * anterior.z;
						  y = Math.cos(-nuevoAngulo) * anterior.y - Math.sin(-nuevoAngulo) * anterior.z;
						  break;

				case 1: y = Math.cos(-nuevoAngulo) * anterior.y - Math.sin(-nuevoAngulo) * anterior.z;
						  z = Math.sin(-nuevoAngulo) * anterior.z + Math.cos(-nuevoAngulo) * anterior.x;
						  break;

				case 2: z = Math.sin(-nuevoAngulo) * anterior.z + Math.cos(-nuevoAngulo) * anterior.x;
						  x = Math.cos(nuevoAngulo) * anterior.x + Math.sin(nuevoAngulo) * anterior.z;
						 break;

			  default: break;
		   }

			// anterior.x = x;
			// anterior.y = y;
			// anterior.z = z;

			anterior.x = x + nuevaLongitud;
			anterior.y = y + nuevaLongitud;
			anterior.z = z + nuevaLongitud;

		   // ptsSpline.push(new THREE.Vector3(x + nuevaLongitud, y + nuevaLongitud, z + nuevaLongitud));
		   // ptsSpline.push(new THREE.Vector3(x, y, z));
			ptsSpline.push(new THREE.Vector3(anterior.x, anterior.y, anterior.z));
		}

		// ptsSpline.push(new THREE.Vector3(nuevaLongitudx, nuevaLongitudy, nuevaLongitudz));
		var spline = new THREE.CatmullRomCurve3(ptsSpline);

		return spline;
	}

	createGUI(gui, titleGui){
		// CREACION DE GUI
		this.guiControls = new function (){
			// variables que queramos toquetear
			this.incrementoRotacion = 0;
			this.posX = 0;
			this.posZ = 0;
			this.posY = 1;
		}

		var folder = gui.addFolder(titleGui);
		folder.add(this.guiControls, 'incrementoRotacion', 0, 0.1, 0.01).name("Velocidad rotación: ").listen();
		folder.add(this.guiControls, 'posX', -10, 10, 1).name("Posición en x: ").listen();
		folder.add(this.guiControls, 'posZ', -10, 10, 1).name("Posición en Z: ").listen();
		folder.add(this.guiControls, 'posY', -10, 10, 1).name("Posición en Y: ").listen();
	}

	update(){
		// CREACION DE UPDATES
		this.rotation.y += this.guiControls.incrementoRotacion;
		this.position.x = this.guiControls.posX;
		this.position.z = this.guiControls.posZ;
		this.position.y = this.guiControls.posY;
	}

	actualizaAnimacion(objeto, t){
		var posicion = this.spline.getPointAt(t);
		objeto.position.copy(posicion);

		var tangente = this.spline.getTangentAt(t);
		posicion.add(tangente);

		objeto.lookAt(posicion);
	}
};

export { Camino };
