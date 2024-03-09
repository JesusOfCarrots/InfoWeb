import * as THREE from 'three';

let FOV = 75;
let width = window.innerWidth * 0.7;
let height = window.innerHeight * 0.7;
let cameraDistance = 5;

let rotationSpeed = 0.02;
let canRotate = true;

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 1000)
const otherSpace = document.getElementById('other');

const renderer = new THREE.WebGLRenderer();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial( {color:0xffd700} );

const cube = new THREE.Mesh(geometry, material);

function setUp(){
    renderer.setSize(width, height);
    renderer.domElement.classList.add('cav');
    document.body.appendChild(renderer.domElement);

    scene.add(cube);
    // Center
    let offsetY = window.innerHeight - height;
    let offsetX = window.innerWidth - width;
    renderer.domElement.style.marginTop = offsetY / 2 + 'px';
    otherSpace.style.width  = offsetX + 'px';

    cam.position.z = cameraDistance;

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