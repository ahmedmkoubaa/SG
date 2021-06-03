import * as Constants from '../Constantes.js'
import * as THREE from '../../libs/three.module.js'

class Cola extends THREE.Object3D {
  constructor(){
    super();
    var posicion_realtiva_x=2*Constants.LONGITUD_CUERPO/3-0.5;
    var longitud_cuerpo=Constants.LONGITUD_CUERPO/3+0.3;
    //var cuerpoGeom=new THREE.CylinderGeometry(0.666667,0.5,longitud_cuerpo,10,10);
    var cuerpoGeom=new THREE.CylinderGeometry(0.686888,0.5,longitud_cuerpo,10,10);
    cuerpoGeom.rotateZ(2*Math.PI/4);

    var aletaGeom=new THREE.CylinderGeometry(0.1,0.3,1.5,5,5);

    aletaGeom.rotateZ(-2*Math.PI/5);
    aletaGeom.scale(1,2,1.5);
    aletaGeom.translate(longitud_cuerpo/2+0.5,0.5,0);

    var aletaAbajoGeom=aletaGeom.clone();
    aletaGeom.translate(posicion_realtiva_x,0,0);
    aletaAbajoGeom.rotateX(2*Math.PI/2);
    aletaAbajoGeom.translate(posicion_realtiva_x,0,0);

    var desplazamiento=longitud_cuerpo/2-0.15;
    cuerpoGeom.translate(desplazamiento,0,0);
    cuerpoGeom.translate(posicion_realtiva_x,0,0);
    aletaGeom.translate(desplazamiento,0,0);
    aletaAbajoGeom.translate(desplazamiento,0,0);


    aletaGeom.rotateY(-2*Math.PI/4);
    aletaAbajoGeom.rotateY(-2*Math.PI/4);
    cuerpoGeom.rotateY(-2*Math.PI/4);

    var cuerpo=new THREE.Mesh(cuerpoGeom,Constants.amarillento);
    var aletaArriba=new THREE.Mesh(aletaGeom,Constants.amarillento);
    var aletaAbajo=new THREE.Mesh(aletaAbajoGeom,Constants.amarillento);

    //cuerpo.translate(10.3,0,0);

    this.add(cuerpo);
    this.add(aletaArriba);
    this.add(aletaAbajo);
    //this.position.x=0.5;

    this.maxRot=0.137799;
    this.minRot=-0.131799;
    this.rot=0;
    this.derecha=true;
    this.vel=0.005;
    // this.position.x=2*Constants.LONGITUD_CUERPO/3-0.5;

  }
  update(){
    if(this.rot<this.maxRot && this.derecha){
      this.rot+=this.vel;
    }else if(this.rot>=this.maxRot){
      this.rot-=this.vel;
      this.derecha=false;
    } else if (this.rot<=this.minRot){
      this.rot+=this.vel;
      this.derecha=true;
    } else{
      this.rot-=this.vel;
    }
    this.rotation.set(0,this.rot,0);
  }
}

export {Cola};
