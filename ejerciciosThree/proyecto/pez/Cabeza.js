import * as Constants from '../Constantes.js'
import * as THREE from '../../libs/three.module.js'

class Cabeza extends THREE.Object3D {
  constructor(){
    super();
    var longitud_cabeza=1.75;
    var posicion_realtiva_x=-Constants.LONGITUD_CUERPO/3/2;

    var cabezaGeom=new THREE.CylinderGeometry(0.4,1,longitud_cabeza,10,10);
    cabezaGeom.rotateZ(2*Math.PI/4);
    cabezaGeom.translate(-longitud_cabeza/2,0,0);
    cabezaGeom.translate(posicion_realtiva_x,0,0);
    cabezaGeom.rotateY(-2*Math.PI/4);

    var cabeza = new THREE.Mesh (cabezaGeom, Constants.amarillento);
    this.add(cabeza);
    var ojoGeom=new THREE.SphereGeometry(0.3,10,5);
    var ojoDetrasGeom=ojoGeom.clone();
    ojoGeom.rotateX(1,48353);
    ojoDetrasGeom.rotateX(-1,48353);
    //ojoGeom.rotateY(-0,872665);
    ojoGeom.translate(-0.75,0.6,0.5);
    ojoDetrasGeom.translate(-0.75,0.6,-0.5);
    ojoGeom.translate(posicion_realtiva_x,0,0);
    ojoDetrasGeom.translate(posicion_realtiva_x,0,0);
    ojoGeom.rotateY(-2*Math.PI/4);
    ojoDetrasGeom.rotateY(-2*Math.PI/4);

    var ojo=new THREE.Mesh(ojoGeom,Constants.negro_brillante);
    var ojoDetras=new THREE.Mesh(ojoDetrasGeom,Constants.negro_brillante);
    this.add(ojo);
    this.add(ojoDetras);
  }
  update(){

  }
}

export {Cabeza};
