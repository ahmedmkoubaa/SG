import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

// import { MyLoadedModel } from './MyLoadedModel.js'
import { TipoRecompensa } from './TipoRecompensa.js'

import {Red} from './red/red.js'
import {RedAbajo} from './red/red.js'

class Camino extends THREE.Object3D {
	constructor (puntos = 10, longitud = 10,										// Parametros para el camino
					numeroObstaculos = 10, maxDesplzamientoObstaculo = 5,		// Parametros para obstaculos del camino
					numeroRecompensas = 10, maxDesplzamientoRecompensa = 5,	// Parametros para recompensas del camino
					maxRadio = 10){														// Parametro para apariencia del camino
		super();

		// textura para simular burbujas
		this.texturaObstaculo = new THREE.TextureLoader().load( '../imgs/bubble.jpg');
		this.texturaRecompensa = new THREE.TextureLoader().load( "../imgs/mistery.png" );
		this.texturaRecompensa.wrapS = THREE.RepeatWrapping;
		this.texturaRecompensa.wrapT = THREE.RepeatWrapping;

		// recorrido que vamos a realizar
		this.spline = this.generarRecorridoAleatorio(puntos, longitud);

		// vector de obstaculos que nos encontraremos en el camino
		this.obstaculosGenerados = [];

		// vector de recompensas que nos encontraremos en el camino
		this.recompensasGeneradas = [];

		this.generarObstaculos(this.spline, numeroObstaculos, maxDesplzamientoObstaculo );
		this.generarRecompensas(this.spline, numeroRecompensas, maxDesplzamientoRecompensa );

		this.forma = this.crearFormaDeTunelCircular(maxRadio);

		var options = {bevelEnabled: false, depth : 1 , steps : puntos * puntos , curveSegments : 25, extrudePath: this.spline};
		// var textura = new THREE.TextureLoader().load( '../imgs/wood.jpg');


		var geometry = new THREE.ExtrudeBufferGeometry(this.forma, options);
		var material = new THREE.MeshPhongMaterial({
			transparent: true,
			opacity: 0.8,
			side: THREE.BackSide,
			// smoothShading: true,
			// shading: THREE.smoothShading,
			color: 0x0000FF,
			// wireframe: true,
			// map: textura
		});

		this.apariencia = new THREE.Mesh( geometry, material ) ;
		this.add( this.apariencia );
	}

	// crea nuevo recorrido, con apariencia incluida y
	// nuevos obstaculos y recompensas
	regenerar(puntos, longitud, numeroObstaculos,
		 		numeroRecompensas = 10, maxDesplzamientoObstaculo = 5,
				maxDesplzamientoRecompensa = 5) {

		this.remove (this.apariencia);	// quitar antigua representacion grafica

		// nuevo recorrido aleatorio
		this.spline = this.generarRecorridoAleatorio(puntos, longitud);

		// nuevos items del camino
		this.generarObstaculos(this.spline, numeroObstaculos, maxDesplzamientoObstaculo);
		this.generarRecompensas(this.spline, numeroRecompensas, maxDesplzamientoRecompensa);

		// forma del camino
		var options = {bevelEnabled: false, depth : 1 , steps : puntos * puntos , curveSegments : 25, extrudePath: this.spline};
		var geometry = new THREE.ExtrudeBufferGeometry(this.forma, options);
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

	// genera las recompensas qe encontraremos en el camino
	generarRecompensas(spline, numeroRecompensas, maxDispersion) {
		var anteriores = this.recompensasGeneradas.length;

		for (var i = 0; i < numeroRecompensas; i++) {

			// sumamos 1 para evitar recompensas en la salida (0)
			var indice = i+1;
			var pos = spline.getPointAt( i / (numeroRecompensas+1) );

			// Aplicar funcion de aleatoriedad a la posicion final de la recompensa
			var dispersion = -maxDispersion + 2 * Math.random() * maxDispersion;

			pos.x += dispersion;
			pos.y += dispersion;
			pos.z += dispersion;

			// reciclar antiguos para evitar sobrecarga
			if (i < anteriores) {
				this.recompensasGeneradas[i].position.copy(pos);
			} else {
				 var recompensa = this.getNuevaRecompensa();
				 recompensa.position.set(pos.x, pos.y, pos.z);
				 this.recompensasGeneradas.push(recompensa);
				 this.add(recompensa);
			}
		}
	}

	// Genera objetos y los dispersa por el camino pasado como parametro
	// target se puede para orientarse a un punto concreto
	generarObstaculos(spline, numeroObstaculos, maxDispersion) {
		// this.obstaculosGenerados = [];

		// se refiere al numero de posiciones en las que puede
		// aparecer un obstaculo con referencia al spline
		const numeroPosiciones = 9;
		var anteriores = this.obstaculosGenerados.length;

		// sumamos 1 para evitar poner obstaculos en la linea de salida
		const finCamino = numeroObstaculos + 1;

		for (var i = 0; i < numeroObstaculos; i++) {
			// sumamos 1 para evitar obstaculos en la linea de salida
			var indice = (i+1) / finCamino;
			var indiceAnterior = i/finCamino;	// Es el indice del punto anterior

			// Siguiente punto del recorrido donde poner un obstaculo
			var pos = spline.getPointAt(indice);

			// copia para reutilizar obstaculos previos
			var posRed = pos.clone();

			// punto anterior del recorrido, mirar hacia alla
			var target = spline.getPointAt(indiceAnterior);

			var sitio = Math.floor(Math.random() * numeroPosiciones);
			var dispersion = maxDispersion;
			// var dispersion = -maxDispersion + 2 * Math.random() * maxDispersion;

			var sitioFinal = sitio % numeroPosiciones;

			switch (sitioFinal) {
				case 0: pos.x -= dispersion; break;	// izquierda
				case 4: pos.x -= dispersion;			// izquierda arriba
						  pos.y += dispersion;
						  break;

				case 1: pos.y += dispersion; break; // arriba
				case 5: pos.y += dispersion;			// arriba derecha
						  pos.x += dispersion;
						  break;

				case 2: pos.x += dispersion; break;	// derecha
				case 6: pos.x += dispersion;			// derecha abajo
						  pos.y -= dispersion;
						  break;

				case 3: pos.y -= dispersion; break;	// abajo
				case 7: pos.y -= dispersion;		   // abajo izquierda
						  pos.x -= dispersion;
						  break;

			   // Para la posicion central, no hacemos nada
				default: break;
			}


			// reciclar anteriores para evitar sobrecarga
			// if ( i < anteriores && this.obstaculosGenerados[i].esRed == undefined ) {
			// if ( false ) {
			if (i < anteriores) {
				// poner el anterior obstaculo en este recorrido
				var anterior = this.obstaculosGenerados[i];

				if (anterior.esRed == true) {
					if (anterior.esRedArriba == true) 		 posRed.y += dispersion;
					else if ( anterior.esRedAbajo == true ) posRed.y -= dispersion;

					pos = posRed.clone();	// al ser la posicion final es de red
				}

				// Modificar los elementos del vector a los que hacemos referencia
				this.obstaculosGenerados[i].position.copy(pos);
				this.obstaculosGenerados[i].lookAt(target);
			}
			else {
				var obstaculo;
				switch (sitioFinal) {
					// si salio arriba
					case 1:
						obstaculo = this.getNuevoObstaculoRed();
						obstaculo.esRedArriba = true;
						break;

					// si salio abajo
					case 3:
						obstaculo = this.getNuevoObstaculoRedAbajo();
						obstaculo.esRedAbajo = true;
						break;

					// en otro caso
					default: obstaculo = this.getNuevoObstaculo(); break;

				}
				// var obstaculo = this.getNuevoObstaculo();
				obstaculo.position.set(pos.x, pos.y, pos.z);

				// orientarse hacia el objetivo
				obstaculo.lookAt(target);
				this.obstaculosGenerados.push(obstaculo);
				this.add(obstaculo);
			}
		}
	}


	// // Genera objetos y los dispersa por el camino pasado como parametro
	// generarObstaculos(spline, numeroObstaculos, maxDispersion,personaje) {
	//
	// 	this.obstaculosGenerados.splice(0, this.obstaculosGenerados.length);
	// 	this.obstaculosGenerados = [];
	//
	// 	const numeroPosiciones = 5;
	//
	// 	// obtener primera posicion, ahi estara el actor
	// 	var posicion = personaje.actor.position;
	//
	// 	for (var i = 1; i < numeroObstaculos; i++) {
	// 		var pos = spline.getPointAt(i / numeroObstaculos);
	//
	// 		// posicion del anterior en el camino
	// 		posicion = spline.getPointAt((i-1) / numeroObstaculos);
	//
	// 		var sitio = Math.floor(Math.random() * numeroPosiciones);
	// 		var dispersion = maxDispersion;
	// 		// var dispersion = -maxDispersion + 2 * Math.random() * maxDispersion;
	//
	// 		var obstaculo="";
	// 		switch (sitio % 5) {
	// 			case 0: pos.x -= dispersion; break;	// izquierda
	// 			case 1: pos.y += dispersion; //arriba
	// 				obstaculo=this.getNuevoObstaculoRed();
	// 			break;
	// 			case 2: pos.x += dispersion; break;	// derecha
	// 			case 3: pos.y -= dispersion; //abajo
	// 				obstaculo=this.getNuevoObstaculoRedAbajo();
	// 			break;
	// 			default: break;
	// 		}
	//
	//
	// 		// var obstaculo = obstaculoOriginal.clone();
	// 		if(obstaculo==""){
	// 			var obstaculo = this.getNuevoObstaculo();
	// 		}
	// 		// obstaculo.rotateY(2*Math.PI/4);
	// 		obstaculo.position.set(pos.x, pos.y, pos.z);
	// 		obstaculo.lookAt(posicion);
	// 		this.obstaculosGenerados.push(obstaculo);
	// 	}
	//
	// 	// añadir aqui fuera el resto de elementos del vector
	//
	// 	var size = this.obstaculosGenerados.length;
	// 	for (var i = 0; i < size; i++)
	// 		this.add(this.obstaculosGenerados[i]);
	// }

	// Metodo que devuelve un obstaculo de manera aleatoria
	getNuevoObstaculo() {
		// Cambiando esta definicion, podemos cambiar todos
		// los obstaculos generados

		var obstaculo = new THREE.Mesh(
			new THREE.SphereBufferGeometry(1.5,10,10),
			new THREE.MeshPhongMaterial({color:0xffffff,
				envMap: this.texturaObstaculo,
			})
		);

		return obstaculo;


		// const numModelos = 4;
		// var nuevo = Math.floor(Math.random() * numModelos);
		//
		// var rutaMtl;
		// var rutaObj;
		//
		// var rotacion = new THREE.Vector3 (0,0,0);
		// var escalado = new THREE.Vector3 (0,0,0);
		//
		// switch (nuevo % numModelos) {
		// 	case 0:
		// 		rutaMtl = '../models/virus/microbe.mtl';
		// 		rutaObj = '../models/virus/microbe.obj';
		// 		escalado = {x:0.3, y:0.3, z:0.3};
		// 		break;
		//
		// 	case 1:
		// 		rutaMtl = '../models/vaso/vaso.mtl';
		// 		rutaObj = '../models/vaso/vaso.obj';
		// 		escalado = {x:0.3, y:0.3, z:0.3};
		// 		break;
		//
		// 	case 2:
		// 		rutaMtl = '../models/botella/botella.mtl';
		// 		rutaObj = '../models/botella/botella.obj';
		// 		escalado = {x:15, y:15, z:15};
		// 		break;
		//
		// 	case 3:
		// 		rutaMtl = '../models/bota/bota.mtl';
		// 		rutaObj = '../models/bota/bota.obj';
		// 		escalado = {x:0.1, y:0.1, z:0.1};
		// 	break;
		//
		// 	default: console.log("modelo de obstaculo no reconocido"); break;
		//
		// }
		//
		// rotacion = {
		// 	x: Math.random() * 2,
		// 	y: Math.random() * 1,
		// 	z: Math.random() * 3
		// }
		//
		//
		// // rutaMtl = '../models/botella/botella.mtl';
		// // rutaObj = '../models/botella/botella.obj';
		//
		//
		// var modelo  = new MyLoadedModel(rutaMtl, rutaObj);
		// modelo.scale.copy(escalado);
		//
		// const angulo = 2 *Math.PI;
		// modelo.rotation.set( Math.random() * angulo, Math.random() * angulo,  Math.random() * angulo);
		//
		// // modelo.scale.set(0.3, 0.3, 0.3);
		//
		// return modelo;
	}

	getNuevoObstaculoRed(){
		var obstaculo = new Red();
		obstaculo.esRed = true;
		return obstaculo;
	}

	getNuevoObstaculoRedAbajo(){
		// devolver el obstaculo red
		var red = this.getNuevoObstaculoRed();

		// rotarlo para que este al reves
		red.redCompleta.rotation.z = Math.PI;

		// devolver el objeto
		return red;
	}

	// Devuelvo un objeto recompensa
	getNuevaRecompensa() {
		// le asigna la textura correspondiente
		var recompensa = new THREE.Mesh(
			new THREE.BoxBufferGeometry(2,2,2),
			new THREE.MeshPhongMaterial({
				opacity: 0.5,
				transparent: true,
				map: this.texturaRecompensa
			})
		);

		// Generar tipo de recompensa aleatoriamente
		recompensa.tipo = Math.floor( Math.random() * TipoRecompensa.NUM_TIPOS );

		return recompensa;
	}

	// Devuelve una forma circular con un agujero, realmente devuelve un marco redondo
	crearFormaDeTunelCircular(circleRadius = 10){
		var shape = new THREE.Shape();
		shape.moveTo( circleRadius, 0 );
		shape.absarc( 0, 0, circleRadius, 0, 2 * Math.PI, false );

		return shape;
	}

	getSpline(){
		return this.spline;
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

			// guardamos anterior
		   var x = anterior.x;
		   var y = anterior.y;
		   var z = anterior.z;

			// calculamos nuuevo angulo de rotacion
			var nuevoAngulo = Math.random() * maxAngulo;
		   // var nuevaLongitud = maxLongitud + Math.random() * maxLongitud;

			// Nuestra nuva longitud sera la maxima que nos han pasado
			var nuevaLongitud = maxLongitud;

			// tenemos 3 ejes, veremos en que eje rotaremos segun la iteracion del bucle
			switch (i%3) {
				// rotar con respecto al eje z
				case 0: x = Math.cos(nuevoAngulo) * anterior.x + Math.sin(nuevoAngulo) * anterior.z;
						  y = Math.cos(-nuevoAngulo) * anterior.y - Math.sin(-nuevoAngulo) * anterior.z;
						  break;

				// rotar con respecto al eje x
				case 1: y = Math.cos(-nuevoAngulo) * anterior.y - Math.sin(-nuevoAngulo) * anterior.z;
						  z = Math.sin(-nuevoAngulo) * anterior.z + Math.cos(-nuevoAngulo) * anterior.x;
						  break;

				// rotar con respecto al eje y
				case 2: z = Math.sin(-nuevoAngulo) * anterior.z + Math.cos(-nuevoAngulo) * anterior.x;
						  x = Math.cos(nuevoAngulo) * anterior.x + Math.sin(nuevoAngulo) * anterior.z;
						  break;

			  default: break;
		   }

			// rotar con respecto al eje anterior tanto como nos diga la longitud
			anterior.x = x + nuevaLongitud;
			anterior.y = y + nuevaLongitud;
			anterior.z = z + nuevaLongitud;

			// aniadir a nuestro vector de puntos
			ptsSpline.push(new THREE.Vector3(anterior.x, anterior.y, anterior.z));
		}

		// generar el CatmullRomCurve3
		var spline = new THREE.CatmullRomCurve3(ptsSpline);

		return spline;
	}

	update(){
		// CREACION DE UPDATES

	}
};

export { Camino };
