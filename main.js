import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

let FOV = 75;
let width = window.innerWidth * 0.7;
let height = window.innerHeight * 0.7;
let cameraDistance = 5;

let canRotate = true;
let cubeSize = 1;

let rotationSpeed = 0.02;
let bgColor = 0x0000;

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 1000)

// Html
const otherSpace = document.getElementById('other');
const backgroundColorPicker = document.getElementById("gbColor");
const fovSlider = document.getElementById('fovSlider');

// Cube
let cubeColor = 0xffd700;
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
const cube = new THREE.Mesh(geometry, material);

// Plane
let planeColor = 0x3b0057;
const planeColorPicker = document.getElementById('planeColor');

const planeGeometry = new THREE.BoxGeometry(10, 5, 1);
const planeMaterial = new THREE.MeshBasicMaterial( {color:planeColor} );
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

// Grid
let showGrid = true;
let gridSize = 30;
const gridCube = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30, 10, 10, 10), new THREE.MeshBasicMaterial({color:0x00ff00, wireframe:true,}))

const gridCheckBox = document.getElementById('gridCheck');
const gridSizeSlider = document.getElementById('gridSizeSlider');

const controls = new OrbitControls(cam, renderer.domElement);

// Event Listener
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    width = window.innerWidth * 0.7;
    height = window.innerHeight * 0.7;

    cam.aspect = width / height;
    cam.updateProjectionMatrix();

    renderer.setSize(width, height);

    // Adjust layout of otherSpace div
    const offsetY = window.innerHeight - height;
    const offsetX = window.innerWidth - width;
    renderer.domElement.style.marginTop = offsetY / 2 + 'px';
    otherSpace.style.width = offsetX + 'px';
    otherSpace.style.top = window.innerHeight * 0.01 + 'px';
}

function colorToThree(hex) {
    hex = String(hex);
    hex = hex.replace('#', '');

    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);

    return new THREE.Color(r / 255, g / 255, b / 255);
}

function Html(){
    // General
    fovSlider.addEventListener('input', () => {
        FOV = parseFloat(fovSlider.value);
        document.getElementById('fovValue').textContent = FOV.toFixed(2);
        cam.fov = FOV;
    });


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

    // Grid size slider
    gridSizeSlider.addEventListener('input', () => {
        gridSize = parseFloat(gridSizeSlider.value);
        document.getElementById('gridSizeValue').textContent = gridSize.toFixed(2);

        gridCube.scale.set(gridSize / 30, gridSize / 30, gridSize / 30);
    });

    // Cube Pos
    cubeX.addEventListener('input', () => {cube.position.set(cubeX.value, cubeY.value, cubeZ.value);});
    cubeY.addEventListener('input', () => {cube.position.set(cubeX.value, cubeY.value, cubeZ.value);});
    cubeZ.addEventListener('input', () => {cube.position.set(cubeX.value, cubeY.value, cubeZ.value);});
    cube.position.set(cubeX.value, cubeY.value, cubeZ.value);
    
    // checkbox
    rotateCheckbox.addEventListener("click", function () {
        canRotate = rotateCheckbox.checked;
    });
    // Grid Checkbox
    gridCheckBox.addEventListener('click', function(){
        showGrid = gridCheckBox.checked;
    });

    // color
    colorPicker.addEventListener('input', function(){
        let hexColor = colorPicker.value;
        cubeColor = colorToThree(hexColor);
        // Update cube color
        cube.material.color.set(cubeColor);
    });
    // bg color
    backgroundColorPicker.addEventListener('input', function(){
        let hexColor = backgroundColorPicker.value;
        bgColor = colorToThree(hexColor);
        // Update bg color
        scene.background = new THREE.Color(bgColor);
    });
    // plane color
    planeColorPicker.addEventListener('input', function(){
        let hexColor = planeColorPicker.value;
        planeColor = colorToThree(hexColor);
        plane.material.color.set(planeColor);
    });
}

function setUp(){
    renderer.setSize(width, height);
    renderer.domElement.classList.add('cav');
    document.body.appendChild(renderer.domElement);

    // Controls
    controls.target.set(1, -1, -1);
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.update();

    // Scene
    scene.background = new THREE.Color(bgColor);
    scene.add(gridCube);
    scene.add(cube);
    scene.add(plane);

    // Center
    let offsetY = window.innerHeight - height;
    let offsetX = window.innerWidth - width;
    renderer.domElement.style.marginTop = offsetY / 2 + 'px';
    otherSpace.style.width  = offsetX + 'px';
    otherSpace.style.top = window.innerHeight * 0.01 + 'px';

    Html();

    // Standart values
    cam.position.z = cameraDistance;
    cube.position.y = 1.5;
    plane.rotation.x = Math.PI / 2;
}

function render(){
    requestAnimationFrame(render);

    controls.update();

    // Draw rotation
    if (canRotate){
        cube.rotation.x += rotationSpeed;
        cube.rotation.y += rotationSpeed;
        cube.rotation.z += rotationSpeed;
    }

    // Draw Grid
    if(showGrid){
        gridCube.visible = true;
    }else{
        gridCube.visible = false;
    }

    cam.updateProjectionMatrix();
    renderer.render(scene, cam);
}

render();
setUp();