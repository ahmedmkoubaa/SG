import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import {Red} from './red/red.js'
import {RedAbajo} from './red/red.js'

// import { MyLoadedModel } from './MyLoadedModel.js'
import { TipoRecompensa } from './TipoRecompensa.js'

class Camino extends THREE.Object3D {
	constructor (puntos = 10, longitud = 10,										// Parametros para el camino
					numeroObstaculos = 10, personaje, maxDesplzamientoObstaculo = 5,		// Parametros para obstaculos del camino
					numeroRecompensas = 10, maxDesplzamientoRecompensa = 5,	// Parametros para recompensas del camino
					maxRadio = 10){														// Parametro para apariencia del camino
		super();

		this.spline = this.generarRecorridoAleatorio(puntos, longitud);
		this.textura = new THREE.TextureLoader().load( '../imgs/bubble.jpg');

		this.generarObstaculos(this.spline, numeroObstaculos, maxDesplzamientoObstaculo,personaje );
		this.generarRecompensas(this.spline, numeroRecompensas, maxDesplzamientoRecompensa );

		var forma = this.crearFormaDeTunelCircular(maxRadio);

		var options = {bevelEnabled: false, depth : 1 , steps : puntos * puntos , curveSegments : 25, extrudePath: this.spline};
		// var textura = new THREE.TextureLoader().load( '../imgs/wood.jpg');


		var geometry = new THREE.ExtrudeBufferGeometry(forma, options);
		var material = new THREE.MeshPhongMaterial({
			transparent: true,
			opacity: 0.8,
			side: THREE.BackSide,
			smoothShading: true,
			shading: THREE.smoothShading,
			color: 0x0000FF,
			// wireframe: true,
			// map: textura
		});

		this.apariencia = new THREE.Mesh( geometry, material ) ;
		this.add( this.apariencia );
	}

	generarRecompensas(spline, numeroRecompensas, maxDispersion) {
		this.recompensasGeneradas = [];

		for (var i = 1; i < numeroRecompensas; i++) {
			var pos = spline.getPointAt( i / numeroRecompensas );

			// Aplicar funcion de aleatoriedad a la posicion final de la recompensa
			var dispersion = -maxDispersion + 2 * Math.random() * maxDispersion;

			pos.x += dispersion;
			pos.y += dispersion;
			pos.z += dispersion;

			var recompensa = this.getNuevaRecompensa();
			recompensa.position.set(pos.x, pos.y, pos.z);

			this.recompensasGeneradas.push(recompensa);
			this.add(recompensa);
		}
	}

	// Genera objetos y los dispersa por el camino pasado como parametro
	generarObstaculos(spline, numeroObstaculos, maxDispersion,personaje) {
		this.obstaculosGenerados = [];
		const numeroPosiciones = 5;

		// obtener primera posicion, ahi estara el actor
		var posicion = this.spline.getPointAt(0);

		for (var i = 1; i < numeroObstaculos; i++) {
			var pos = spline.getPointAt(i / numeroObstaculos);

			var sitio = Math.floor(Math.random() * numeroPosiciones);
			var dispersion = maxDispersion;
			// var dispersion = -maxDispersion + 2 * Math.random() * maxDispersion;

			var obstaculo="";
			switch (sitio % 5) {
				case 0: pos.x -= dispersion; break;	// izquierda
				case 1: pos.y += dispersion; //arriba
					obstaculo=this.getNuevoObstaculoRed();
				break;
				case 2: pos.x += dispersion; break;	// derecha
				case 3: pos.y -= dispersion; //abajo
					obstaculo=this.getNuevoObstaculoRedAbajo();
				break;
				default: break;
			}


			// var obstaculo = obstaculoOriginal.clone();
			if(obstaculo==""){
				var obstaculo = this.getNuevoObstaculo();
			}
			// obstaculo.rotateY(2*Math.PI/4);
			obstaculo.position.set(pos.x, pos.y, pos.z);
			obstaculo.lookAt(posicion);
			this.obstaculosGenerados.push(obstaculo);
		}

		// añadir aqui fuera el resto de elementos del vector
		var size = this.obstaculosGenerados.length;
		for (var i = 0; i < size; i++)
			this.add(this.obstaculosGenerados[i]);
	}

	// Metodo que devuelve un obstaculo
	getNuevoObstaculo() {
		// Cambiando esta definicion, podemos cambiar todos
		// los obstaculos generados

		var obstaculo = new THREE.Mesh(
			new THREE.SphereBufferGeometry(1.5,10,10),
			new THREE.MeshPhongMaterial({color:0xffffff,
				envMap: this.textura,
			})
		);

		return obstaculo;

		// var rutaMtl = '../models/virus/microbe.mtl';
		// var rutaObj = '../models/virus/microbe.obj';
		// var modelo = new MyLoadedModel(rutaMtl, rutaObj);
		// // modelo.scale.set(0.5, 0.5, 0.5);
		// return modelo;
	}

	getNuevoObstaculoRed(){
		var obstaculo=new Red();
		// var posicion = this.spline.getPointAt(t);
		// obstaculo.position.copy(posicion);
		//
		// var tangente = this.spline.getTangentAt(t);
		// obstaculo.add(tangente);
		//
		// obstaculo.lookAt(posicion);
		return obstaculo;
	}
	getNuevoObstaculoRedAbajo(){
		var obstaculo=new RedAbajo();
		// var posicion = this.spline.getPointAt(t);
		// obstaculo.position.copy(posicion);
		//
		// var tangente = this.spline.getTangentAt(t);
		// obstaculo.add(tangente);
		//
		// obstaculo.lookAt(posicion);
		return obstaculo;
	}

	getNuevaRecompensa() {
		var recompensa = new THREE.Mesh(
			new THREE.BoxBufferGeometry(2,2,2),
			new THREE.MeshNormalMaterial({
				opacity: 0.5,
				transparent: true
			})
		);

		// Asignar tipo de recompensa aleatoriamente
		recompensa.tipo = Math.floor( Math.random() * TipoRecompensa.NUM_TIPOS );

		return recompensa;
	}

	// Devuelve una forma circular con un agujero, realmente devuelve un marco redondo
	crearFormaDeTunelCircular(circleRadius = 10){
		// var forma = new THREE.Shape();
		//
		// var grosor = 1;	// Para asignar el tamanio interior en funcion del exterior
		//
		// var tamnanioExterior = 10;
		// var tamanioInterior = (tamnanioExterior - grosor);
		//
		// var factor = 2; // Para estirar en las curvas cuadraticas
		//
		//
		// forma.moveTo( tamnanioExterior , tamnanioExterior);
		// forma.quadraticCurveTo( factor*tamnanioExterior ,-tamnanioExterior/2, tamnanioExterior ,-tamnanioExterior);
		// forma.quadraticCurveTo(-tamnanioExterior/2 ,factor*-tamnanioExterior, -tamnanioExterior ,-tamnanioExterior);
		// forma.quadraticCurveTo(factor*-tamnanioExterior , tamnanioExterior/2, -tamnanioExterior , tamnanioExterior);
		// forma.quadraticCurveTo( tamnanioExterior/2 , factor*tamnanioExterior, tamnanioExterior , tamnanioExterior);
		//
		//
		// forma.quadraticCurveTo( tamanioInterior, tamanioInterior,  tamanioInterior, tamanioInterior);
		// forma.quadraticCurveTo(-tamanioInterior/2, factor*tamanioInterior, -tamanioInterior, tamanioInterior);
		// forma.quadraticCurveTo(factor*-tamanioInterior,-tamanioInterior/2, -tamanioInterior,-tamanioInterior);
		// forma.quadraticCurveTo( tamanioInterior/2,factor*-tamanioInterior,  tamanioInterior,-tamanioInterior);
		// forma.quadraticCurveTo( factor*tamanioInterior, tamanioInterior/2,  tamanioInterior, tamanioInterior);
		//
		//
		// return forma;

		var shape = new THREE.Shape();
		shape.moveTo( circleRadius, 0 );
		shape.absarc( 0, 0, circleRadius, 0, 2 * Math.PI, false );

		return shape;

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

	// Genera un recorrido totalmente aleatorio formado por tantos puntos como se indique
	// con puntos separados por una longitud maxima pasada como parametro
	// y el angulo maximo de rotacion entre un punto y el siguiente viene indicado
	// por angulo
	generarRecorridoAleatorio(puntos = 10, longitud = 10, angulo = Math.PI/5) {
		var ptsSpline = [];
		var numeroGenerarPuntos = puntos;
		var maxLongitud = longitud;
		var maxAngulo = angulo; // Math.PI; // son radines

		var origen = {x: 0, y: 0, z: 0};
		var anterior = origen;

		for (var i = 0; i < numeroGenerarPuntos; i++) {
		   var x = anterior.x;
		   var y = anterior.y;
		   var z = anterior.z;

			var nuevoAngulo = Math.random() * maxAngulo;
		   var nuevaLongitud = maxLongitud + Math.random() * maxLongitud;

			nuevaLongitud = maxLongitud;

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
		// this.rotation.y += this.guiControls.incrementoRotacion;
		// this.position.x = this.guiControls.posX;
		// this.position.z = this.guiControls.posZ;
		// this.position.y = this.guiControls.posY;
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
