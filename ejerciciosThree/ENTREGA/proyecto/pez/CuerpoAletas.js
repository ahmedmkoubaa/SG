import * as Constants from '../Constantes.js'
import * as THREE from '../../libs/three.module.js'

class CuerpoAletas extends THREE.Object3D {
  constructor(){
    super();
    var posicion_realtiva_x=Constants.LONGITUD_CUERPO/3;

    var cuerpoGeom=new THREE.CylinderGeometry(0.833333,0.666667,Constants.LONGITUD_CUERPO/3,10,10);
    cuerpoGeom.rotateZ(2*Math.PI/4);
    cuerpoGeom.translate(posicion_realtiva_x,0,0);

    var aletitaGeom=new THREE.CylinderGeometry(0.1,0.3,1.5,5,5);
    aletitaGeom.rotateZ(2*Math.PI/4.5);
    aletitaGeom.rotateY(2*Math.PI/2.4);
    aletitaGeom.scale(0.7,1.5,1);
    aletitaGeom.translate(0,0,1);

    var aletitaDetrasGeom=aletitaGeom.clone();
    aletitaGeom.translate(posicion_realtiva_x,0,0);
    aletitaDetrasGeom.rotateY(2*Math.PI/4);
    aletitaDetrasGeom.translate(-1,0,-1);
    aletitaDetrasGeom.translate(posicion_realtiva_x,0,0);

    cuerpoGeom.rotateY(-2*Math.PI/4);
    aletitaGeom.rotateY(-2*Math.PI/4);
    aletitaDetrasGeom.rotateY(-2*Math.PI/4);

    this.cuerpo=new THREE.Mesh(cuerpoGeom,Constants.amarillento);
    this.aletita=new THREE.Mesh(aletitaGeom,Constants.amarillento);
    this.aletitaDetras=new THREE.Mesh(aletitaDetrasGeom,Constants.amarillento);
    this.add(this.cuerpo);
    this.add(this.aletita);
    this.add(this.aletitaDetras);

    this.maxRot=0.261799;
    this.minRot=-0.261799;
    this.rot=0;
    this.abajo=true;
    this.vel=0.01;


  }
  update(){
    if(this.rot<this.maxRot && this.abajo){
      this.rot+=this.vel;
    }else if(this.rot>=this.maxRot){
      this.rot-=this.vel;
      this.abajo=false;
    } else if (this.rot<=this.minRot){
      this.rot+=this.vel;
      this.abajo=true;
    } else{
      this.rot-=this.vel;
    }
    this.aletita.rotation.set(0,this.rot,0);
    this.aletitaDetras.rotation.set(0,-this.rot,0);
    //this.cuerpo.rotation.set(0,this.rot,0);
  }
}

export {CuerpoAletas};
