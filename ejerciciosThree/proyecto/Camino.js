import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class Camino extends THREE.Object3D {
	constructor (puntos = 10, longitud = 10, numeroObstaculos = 10, maxDesplzamientoObstaculo = 5){
		super();
		// this.createGUI(gui, titleGui);

		this.spline = this.generarRecorridoAleatorio(puntos, longitud);
		var forma = this.crearFormaDeTunelCircular();
		this.generarObstaculos(this.spline, numeroObstaculos, maxDesplzamientoObstaculo );

		var options = {bevelEnabled: false, depth : 1 , steps : puntos * puntos , curveSegments : 1, extrudePath: this.spline};

		var textureFront = new THREE.ImageUtils.loadTexture( '../imgs/water.jpg');
		var textureSide = new THREE.ImageUtils.loadTexture( '../imgs/water.jpg');
		var materialFront = new THREE.MeshBasicMaterial( { map: textureFront } );
		var materialSide = new THREE.MeshBasicMaterial( { map: textureSide } );

		// todo esto esta mal la verdad es una perdida de tiempo
		materialSide.map.repeat.set(0.1, 0.1);
		materialFront.map.repeat.set(0.1, 0.1);

		materialSide.wrapS = THREE.ClampToEdgeWrapping;
		materialSide.wrapT = THREE.ClampToEdgeWrapping;
		materialFront.wrapS = THREE.ClampToEdgeWrapping;
		materialFront.wrapT = THREE.ClampToEdgeWrapping;


		var materialArray = [ materialFront, materialSide ];
		var faceMaterial = new THREE.MeshFaceMaterial(materialArray);

		var geometry = new THREE.ExtrudeBufferGeometry(forma, options);
		var material = new THREE.MeshNormalMaterial({flatShading: true, shading: THREE.SmoothShading });
		var caminoConForma = new THREE.Mesh( geometry, faceMaterial ) ;

		var linea = new THREE.Geometry();
		linea.vertices = this.spline.getPoints(100);
		var material = new THREE.LineBasicMaterial({color: 0xff0000});
		var visibleSpline = new THREE.Line(linea, material);

		this.add(visibleSpline);
		this.add( caminoConForma );
	}

	// Genera objetos y los dispersa por el camino pasado como parametro
	generarObstaculos(spline, numeroObstaculos, maxDispersion) {
		var obstaculo = new THREE.Mesh(
			new THREE.SphereBufferGeometry(1),
			new THREE.MeshNormalMaterial({color: 0xffffff})
		);

		this.posicionObstaculos = [];

		for (var i = 1; i < numeroObstaculos; i++){
			var pos = spline.getPointAt(i/numeroObstaculos);
			// Generamos una dispersion alatoria del punto encontrado
			// var dispersionAleatoria = -maxDispersion + 2 * Math.random() * maxDispersion;
			//
			// switch (i%2) {
			// 	case 0: pos.x += dispersionAleatoria; break;
			// 	case 1: pos.y += dispersionAleatoria; break;
			// 	default: console.log("Ha ocurrido un error"); break;
			//
			// }

			var aleatorio = Math.floor(Math.random() * 5);

			switch (aleatorio % 5) {
				case 0: pos.x -= maxDispersion; break;	// izquierda
				case 1: pos.y += maxDispersion; break; // arriba
				case 2: pos.x += maxDispersion; break;	// derecha
				case 3: pos.y -= maxDispersion; break;	// abajo
				default: break;
			}

			obstaculo.position.set(pos.x, pos.y, pos.z);
			var copia = obstaculo.clone();
			this.posicionObstaculos.push(copia.position);

			this.add(copia);
		}
	}

	// Devuelve una forma circular con un agujero, realmente devuelve un marco redondo
	crearFormaDeTunelCircular(){
		var forma = new THREE.Shape();

		var grosor = 1;	// Para asignar el tamanio interior en funcion del exterior

		var tamnanioExterior = 10;
		var tamanioInterior = (tamnanioExterior - grosor);

		var factor = 2; // Para estirar en las curvas cuadraticas


		forma.moveTo( tamnanioExterior , tamnanioExterior);
		forma.quadraticCurveTo( factor*tamnanioExterior ,-tamnanioExterior/2, tamnanioExterior ,-tamnanioExterior);
		forma.quadraticCurveTo(-tamnanioExterior/2 ,factor*-tamnanioExterior, -tamnanioExterior ,-tamnanioExterior);
		forma.quadraticCurveTo(factor*-tamnanioExterior , tamnanioExterior/2, -tamnanioExterior , tamnanioExterior);
		forma.quadraticCurveTo( tamnanioExterior/2 , factor*tamnanioExterior, tamnanioExterior , tamnanioExterior);


		forma.quadraticCurveTo( tamanioInterior, tamanioInterior,  tamanioInterior, tamanioInterior);
		forma.quadraticCurveTo(-tamanioInterior/2, factor*tamanioInterior, -tamanioInterior, tamanioInterior);
		forma.quadraticCurveTo(factor*-tamanioInterior,-tamanioInterior/2, -tamanioInterior,-tamanioInterior);
		forma.quadraticCurveTo( tamanioInterior/2,factor*-tamanioInterior,  tamanioInterior,-tamanioInterior);
		forma.quadraticCurveTo( factor*tamanioInterior, tamanioInterior/2,  tamanioInterior, tamanioInterior);

		return forma;
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
