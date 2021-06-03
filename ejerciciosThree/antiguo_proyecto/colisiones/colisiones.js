import * as THREE from '../../../libs/three.module.js'
//import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'


function cajaEnvolvente(mesh){
  const box = new THREE.Box3();
  mesh.geometry.computeBoundingBox();
  box.copy( mesh.geometry.boundingBox ).applyMatrix4( mesh.matrixWorld );
//
// const helper = new THREE.Box3Helper( box, 0xffff00 );
//
//   return helper;

}

function esferaEnvolvente(mesh){
  let m = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  	opacity: 0.3,
  	transparent: true
  });

  const sphere = new THREE.Sphere();
  mesh.geometry.computeBoundingSphere();
  sphere.copy( mesh.geometry.boundingSphere ).applyMatrix4( mesh.matrixWorld );

  //var sphM=new THREE.Mesh(new THREE.SphereGeometry(sphere.radious,32,32),m);
  return sphere;
}

function cajaChocaConCaja(caja1, caja2){
  return caja1.intersectsBox(caja2);
}
function cajaChocaConEsfera(caja, esfera){
  return caja.intersectsSphere(esfera);
}
function esferaChocaConCaja(esfera, caja){
  return esfera.intersectsBox(caja);
}
function esferaChocaConEsfera(esfera1, esfera2){
  return esfera1.intersectsSphere(esfera2);
}

class Caja extends THREE.Object3D {
  constructor() {
    super();
    var cylGeom=new THREE.CylinderBufferGeometry(0.5,1,1,10,10);
    cylGeom.translate(0,5,0);
    var cylMat=new THREE.MeshNormalMaterial();
    cylMat.flatShading=true;
    var cylinder=new THREE.Mesh(cylGeom,cylMat);
    //cylinder.position.y=5;
    this.add(cylinder);
    var box=cajaEnvolvente(cylinder);
    //this.add(box);

    var sphere=esferaEnvolvente(cylinder);
    this.add(sphere);

  }

  update () {
  }
}

export { Caja };
