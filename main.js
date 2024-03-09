import * as THREE from 'three';

let FOV = 75;
let width = window.innerWidth;
let height = window.innerHeight;

let rotationSpeed = 0.02;
let canRotate = true;

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 100)

const renderer = new THREE.WebGLRenderer();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial( {color:0xffd700} );

const cube = new THREE.Mesh(geometry, material);


function setUp(){
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    scene.add(cube);

    cam.position.z = 5;

    render();
}

function render(){
    requestAnimationFrame(render);

    if (canRotate){
        cube.rotation.x += rotationSpeed;
        cube.rotation.y += rotationSpeed;
        cube.rotation.z += rotationSpeed;
    }

    renderer.render(scene, cam);
}

setUp();