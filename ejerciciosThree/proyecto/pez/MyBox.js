import * as THREE from '../../libs/three.module.js'

class MyBox extends THREE.Object3D {
  constructor() {
    super();

    this.comecocos=new Comecocos();
    this.add(this.comecocos);

    this.crearSpline();
		this.crearTween();

		var geometriaLinea = new THREE.Geometry();
		geometriaLinea.vertices = this.spline.getPoints(100);
		var line_spline = new THREE.Line(geometriaLinea, new THREE.LineBasicMaterial( { color: 0xff0000 } ));

		this.add(line_spline);

  }


  crearSpline(){
      var altura=5;
      this.spline = new THREE.CatmullRomCurve3([
			new THREE.Vector3(0, altura, 0),
			new THREE.Vector3(10, altura, 0),
			new THREE.Vector3(10, altura, 4),
			new THREE.Vector3(-8, altura, 4),
			new THREE.Vector3(-8, altura, 0),
			new THREE.Vector3(-6, altura, -6),
			new THREE.Vector3(-4, altura, -8),
      new THREE.Vector3(-1, altura, -8),
      new THREE.Vector3(0, altura, 0)
		]);
	};

  crearTween(){
		this.parametro = 0;
    var origen = {x: 0};
    var destino = {x: 0.5}
    this.movimiento = new TWEEN.Tween(origen).to(destino, 4000);
    this.movimiento.easing(TWEEN.Easing.Quadratic.InOut);

    var that = this;
    this.movimiento.onUpdate(function () {
        that.parametro = origen.x;
        var posicion = that.spline.getPointAt(that.parametro);
        that.comecocos.position.copy(posicion);

        var tangente = that.spline.getTangentAt(that.parametro);
        posicion.add(tangente);
        that.comecocos.lookAt(posicion);
    });

    var origen2 = {x : 0.5};
    var destino2 = {x : 1};
    this.movimiento2 = new TWEEN.Tween(origen2).to(destino2, 6000);
    this.movimiento2.easing(TWEEN.Easing.Quadratic.InOut);

    this.movimiento2.onUpdate(function (){
        that.parametro = origen2.x;
        var posicion = that.spline.getPointAt(that.parametro);
        that.comecocos.position.copy(posicion);

        var tangente = that.spline.getTangentAt(that.parametro);
        posicion.add(tangente);
        that.comecocos.lookAt(posicion);

    });

    this.movimiento.chain(this.movimiento2);
    this.movimiento2.chain(this.movimiento);
    this.movimiento.start();
    };

  update () {
    TWEEN.update();
  }
}

export { MyBox };
