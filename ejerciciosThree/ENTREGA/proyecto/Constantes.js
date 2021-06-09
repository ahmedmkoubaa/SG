import * as THREE from '../libs/three.module.js'

//--------Pez-----------

export const LONGITUD_CUERPO = 3

//---------Colores-------------

export const amarillento = new THREE.MeshPhongMaterial({color: 0xa9aa00, emissive:0x10125f, specular:0xac4b59});
export const negro = new THREE.MeshPhongMaterial({color: 0x000000});
export const blanco = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
export const negro_brillante = new THREE.MeshPhongMaterial({color: 0x000000,specular:0xFFFFFF,shininess:20});
export const rojo = new THREE.MeshPhongMaterial({color: 0xFF0000});
export const blancowire = new THREE.MeshPhongMaterial({color: 0xFFFFFF,wireframe:true});
