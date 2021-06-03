import * as THREE from '../../../libs/three.module.js'
import * as TWEEN from '../../../libs/tween.esm.js'
import * as Constants from '../Constantes.js'
import {Cola} from './Cola.js'
import {CuerpoAletas} from './CuerpoAletas.js'
import {Cabeza} from './Cabeza.js'

class Pez extends THREE.Object3D {
  constructor() {
    super();

    var cuelloGeom=new THREE.CylinderGeometry(1,0.833333,Constants.LONGITUD_CUERPO/3,10,10);
    cuelloGeom.rotateZ(2*Math.PI/4);
    cuelloGeom.rotateY(-2*Math.PI/4);
    this.cuello=new THREE.Mesh(cuelloGeom,Constants.amarillento);
    this.cuerpoAleta=new CuerpoAletas();
    this.cola=new Cola();
    this.cabeza=new Cabeza();
    // this.cola.position.x=2*Constants.LONGITUD_CUERPO/3-0.5;
    // this.cuerpoAleta.position.x=Constants.LONGITUD_CUERPO/3;
    // this.cabeza.position.x=-Constants.LONGITUD_CUERPO/3/2;
    // this.cuello.add(this.cabeza);
    this.cuerpoAleta.add(this.cola);
    // this.cuerpoAleta.rotateY(-2*Math.PI/4);
    // this.cuello.rotateY(-2*Math.PI/4);
    // this.cabeza.rotateY(-2*Math.PI/4);
    // this.cuello.add(this.cuerpoAleta);

    this.add(this.cuello);
    this.add(this.cabeza);
    this.add(this.cuerpoAleta);

    // this.saltar();
    // this.position.z=5;
    // this.girarIzquierda();
  }
  saltar(or,dest){
    var origen={y:-dest};
    var destino={y:or-1};
    var movimiento=new TWEEN.Tween(origen).to(destino,500);
    movimiento.easing(TWEEN.Easing.Quadratic.InOut);
    var that=this;
    movimiento.onUpdate(function(){
      that.cabeza.rotation.set(0.374533,0,0);
      that.cabeza.position.y=origen.y;
      that.cuello.position.y=origen.y;

      that.cuello.rotation.set(0.323599,0,0);

      that.cuerpoAleta.position.y=origen.y;
      that.cuerpoAleta.rotation.set(0.449066,0,0);

    });
    var destino1={y:or}
    var movimiento1=new TWEEN.Tween(destino).to(destino1,80);
    movimiento1.easing(TWEEN.Easing.Quadratic.InOut);
    movimiento1.onUpdate(function(){
      that.cuello.position.y=destino.y;
      that.cabeza.position.y=destino.y;
      that.cuerpoAleta.position.y=destino.y;

      that.cuello.rotation.set(0,0,0);
      that.cabeza.rotation.set(0,0,0);
      that.cuerpoAleta.rotation.set(0,0,0);
    });
    movimiento.chain(movimiento1);
    movimiento.start();
  }


  goDown(or,dest){
    var destino={y:or-1};
    var that=this;
    var destino1={y:or}
    var movimiento1=new TWEEN.Tween(destino).to(destino1,150);
    movimiento1.easing(TWEEN.Easing.Quadratic.InOut);
    movimiento1.onUpdate(function(){
      that.cuello.position.y=destino.y;
      that.cabeza.position.y=destino.y;
      that.cuerpoAleta.position.y=destino.y;

      that.cuello.rotation.set(0,0,0);
      that.cabeza.rotation.set(0,0,0);
      that.cuerpoAleta.rotation.set(0,0,0);
    });
    var destino2={y:dest};
    var movimiento2=new TWEEN.Tween(destino1).to(destino2,250);
    movimiento2.easing(TWEEN.Easing.Quadratic.InOut);
    movimiento2.onUpdate(function(){
      that.cuello.position.y=destino1.y;
      that.cabeza.position.y=destino1.y;
      that.cuerpoAleta.position.y=destino1.y;

      that.cuello.rotation.set(-0.785398,0,0);
      that.cabeza.rotation.set(-0.805398,0,0);
      that.cuerpoAleta.rotation.set(-0.405398,0,0);
    });
    var movimiento3=new TWEEN.Tween(destino2).to(destino2,80);
    movimiento3.onUpdate(function(){
      that.cuello.position.y=destino2.y;
      that.cabeza.position.y=destino2.y;
      that.cuerpoAleta.position.y=destino2.y;

      that.cuello.rotation.set(0,0,0);
      that.cabeza.rotation.set(0,0,0);
      that.cuerpoAleta.rotation.set(0,0,0);
    });
    movimiento1.chain(movimiento2);
    movimiento2.chain(movimiento3);
    movimiento1.start();
  }

  girarDerecha(or,dest){
    var origen={x:or};
    var movimiento3=new TWEEN.Tween(origen).to(origen,150);
    movimiento3.easing(TWEEN.Easing.Quadratic.InOut);
    var that=this;
    movimiento3.onUpdate(function(){
      that.cabeza.position.x=origen.x;
      // that.cabeza.rotation.set(0,-0.574533,0);

      that.cuello.position.x=origen.x;
      // that.cuello.rotation.set(0,-0.423599,0);

      that.cuerpoAleta.position.x=origen.x;
      that.cuerpoAleta.rotation.set(0,-0.3,0);

    });
    // var origen={x:or};
    var destino={x:dest};
    var movimiento=new TWEEN.Tween(origen).to(destino,250);
    movimiento.easing(TWEEN.Easing.Quadratic.InOut);
    // var that=this;
    movimiento.onUpdate(function(){
      that.cabeza.position.x=origen.x;
      that.cabeza.rotation.set(0,-0.574533,0);

      that.cuello.position.x=origen.x;
      that.cuello.rotation.set(0,-0.423599,0);

      that.cuerpoAleta.position.x=origen.x;
      that.cuerpoAleta.rotation.set(0,-0.3,0);

    });
    var destino1={x:dest};
    var movimiento1=new TWEEN.Tween(destino).to(destino1,80);
    movimiento1.easing(TWEEN.Easing.Quadratic.InOut);
    movimiento1.onUpdate(function(){
      that.cuello.position.x=destino.x;
      that.cabeza.position.x=destino.x;
      that.cuerpoAleta.position.x=destino.x;

      that.cuello.rotation.set(0,0,0);
      that.cabeza.rotation.set(0,0,0);
      that.cuerpoAleta.rotation.set(0,0,0);
    });
    movimiento3.chain(movimiento);
    movimiento.chain(movimiento1);
    // movimiento1.chain(movimiento3);
    movimiento3.start();
  }
  girarIzquierda(or,dest){
    // or=or;
    var origen={x:or};
    var movimiento3=new TWEEN.Tween(origen).to(origen,300);
    movimiento3.easing(TWEEN.Easing.Quadratic.InOut);
    var that=this;
    movimiento3.onUpdate(function(){
      that.cabeza.position.x=origen.x;
      // that.cabeza.rotation.set(0,-0.574533,0);

      that.cuello.position.x=origen.x;
      // that.cuello.rotation.set(0,-0.423599,0);

      that.cuerpoAleta.position.x=origen.x;
      that.cuerpoAleta.rotation.set(0,0.3,0);

    });
    var origen={x:or};
    var destino={x:dest};
    var movimiento=new TWEEN.Tween(origen).to(destino,500);
    movimiento.easing(TWEEN.Easing.Quadratic.InOut);
    // var that=this;
    movimiento.onUpdate(function(){
      that.cabeza.position.x=origen.x;
      that.cabeza.rotation.set(0,0.574533,0);

      that.cuello.position.x=origen.x;
      that.cuello.rotation.set(0,0.423599,0);

      that.cuerpoAleta.position.x=origen.x;
      that.cuerpoAleta.rotation.set(0,0.3,0);

    });
    var destino1={x:dest};
    var movimiento1=new TWEEN.Tween(destino).to(destino1,500);
    movimiento1.easing(TWEEN.Easing.Quadratic.InOut);
    movimiento1.onUpdate(function(){
      that.cuello.position.x=destino.x;
      that.cabeza.position.x=destino.x;
      that.cuerpoAleta.position.x=destino.x;

      that.cuello.rotation.set(0,0,0);
      that.cabeza.rotation.set(0,0,0);
      that.cuerpoAleta.rotation.set(0,0,0);
    });
    movimiento3.chain(movimiento);
    movimiento.chain(movimiento1);
    // movimiento1.chain(movimiento3);
    movimiento.start();
  }
  update(){
    TWEEN.update();
     this.cola.update();
    // cabeza.update();
     this.cuerpoAleta.update();
  }

}

export { Pez };
