import * as THREE from 'three';
import {
    OrbitControls
  } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

let FOV = 75;
let width = window.innerWidth * 0.7;
let height = window.innerHeight * 0.7;
let cameraDistance = 5;

let canRotate = true;
let cubeSize = 1;

let rotationSpeed = 0.02;
let cubeColor = 0xffd700;
let bgColor = 0x0000;

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 1000)

// Html
const otherSpace = document.getElementById('other');
const backgroundColorPicker = document.getElementById("gbColor");

// Cube
const cubeX = document.getElementById('cubeX');
const cubeY = document.getElementById('cubeY');
const cubeZ = document.getElementById('cubeZ');

const rotationSpeedSlider = document.getElementById('slider');
const cubeSizeSlider = document.getElementById('cubeSizeSlider');
const rotateCheckbox = document.getElementById('rotateCheckbox');
const colorPicker = document.getElementById("colorPicker");

const renderer = new THREE.WebGLRenderer();
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshBasicMaterial( {color:cubeColor} );



// Plane
const planeGeometry = new THREE.BoxGeometry(10, 5, 1);
const planeMaterial = new THREE.MeshBasicMaterial( {color: 0x800080, side: THREE.DoubleSide} );

const frameCube = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30, 10, 10, 10), new THREE.MeshBasicMaterial({color:0x00ff00, wireframe:true,}))

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
const cube = new THREE.Mesh(geometry, material);

function hexToRgb(hex) {
    hex = String(hex);
    hex = hex.replace('#', '');

    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);

    return new THREE.Color(r / 255, g / 255, b / 255);
}

function updateCubePos(){
    cube.position.set(cubeX.value, cubeY.value, cubeZ.value);
}

function getHtmlValues(){
    // rotation slider
    rotationSpeedSlider.addEventListener('input', () => {
        rotationSpeed = parseFloat(rotationSpeedSlider.value);
        document.getElementById('sliderValue').textContent = rotationSpeed.toFixed(2);
    });

    // cube slider
    cubeSizeSlider.addEventListener('input', () => {
        cubeSize = parseFloat(cubeSizeSlider.value);
        document.getElementById('cubeSizeValue').textContent = cubeSize.toFixed(2);
        // update the cube size
        cube.scale.set(cubeSize, cubeSize, cubeSize);
    });

    // Cube Pos
    cubeX.addEventListener('input', updateCubePos);
    cubeY.addEventListener('input', updateCubePos);
    cubeZ.addEventListener('input', updateCubePos);
    updateCubePos();
    
    // checkbox
    rotateCheckbox.addEventListener("click", function () {
        canRotate = rotateCheckbox.checked
    });

    // color
    colorPicker.addEventListener('input', function(){
        let hexColor = colorPicker.value;
        cubeColor = hexToRgb(hexColor);
        // Update cube color
        cube.material.color.set(cubeColor);
    });
    // bg color
    backgroundColorPicker.addEventListener('input', function(){
        let hexColor = backgroundColorPicker.value;
        bgColor = hexToRgb(hexColor);
        // Update bg color
        scene.background = new THREE.Color(bgColor);
    });
}

const controls = new OrbitControls(cam, renderer.domElement);
controls.target.set(1, -1, -1);
controls.enableZoom = true;
controls.enableDamping = true;
controls.update();

function setUp(){

    renderer.setSize(width, height);
    renderer.domElement.classList.add('cav');
    document.body.appendChild(renderer.domElement);

    scene.background = new THREE.Color(bgColor);
    scene.add(frameCube);
    scene.add(cube);
    scene.add(plane);

    // Center
    let offsetY = window.innerHeight - height;
    let offsetX = window.innerWidth - width;
    renderer.domElement.style.marginTop = offsetY / 2 + 'px';
    otherSpace.style.width  = offsetX + 'px';
    otherSpace.style.top = window.innerHeight * 0.3 + 'px';

    getHtmlValues();

    cam.position.z = cameraDistance;
    plane.rotation.x = Math.PI / 2;

    render();
}

function render(){
    requestAnimationFrame(render);

    controls.update();

    if (canRotate){
        cube.rotation.x += rotationSpeed;
        cube.rotation.y += rotationSpeed;
        cube.rotation.z += rotationSpeed;
    }

    renderer.render(scene, cam);
}

setUp();