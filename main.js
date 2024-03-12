import * as three from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

// General
let FOV = 75;
let cameraDistance = 5;
let width = window.innerWidth * 0.7;
let height = window.innerHeight * 0.7;

let bgColor = 0x0000;

const scene = new three.Scene();
const cam = new three.PerspectiveCamera(FOV, width / height, 0.1, 1000);
const renderer = new three.WebGLRenderer();

// Html
const otherSpace = document.getElementById('other');
const backgroundColorPicker = document.getElementById("gbColor");
const fovSlider = document.getElementById('fovSlider');

// Cube
let canRotate = true;
let rotationSpeed = 0.02;
let cubeSize = 1;
let cubeColor = 0xffd700;
const cubeX = document.getElementById('cubeX');
const cubeY = document.getElementById('cubeY');
const cubeZ = document.getElementById('cubeZ');

const rotationSpeedSlider = document.getElementById('slider');
const rotateCheckbox = document.getElementById('rotateCheckbox');
const cubeSizeSlider = document.getElementById('cubeSizeSlider');
const colorPicker = document.getElementById("colorPicker");

const geometry = new three.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new three.MeshBasicMaterial( {color:cubeColor} );
const cube = new three.Mesh(geometry, material);

// Plane
let planeColor = 0x3b0057;
const planeColorPicker = document.getElementById('planeColor');
const planeGeometry = new three.BoxGeometry(10, 5, 1);
const planeMaterial = new three.MeshBasicMaterial( {color:planeColor} );
const plane = new three.Mesh(planeGeometry, planeMaterial);

// Grid
let showGrid = true;
let gridSize = 30;

const gridCheckBox = document.getElementById('gridCheck');
const gridSizeSlider = document.getElementById('gridSizeSlider');

const gridCube = new three.Mesh(new three.BoxGeometry(30, 30, 30, 10, 10, 10), new three.MeshBasicMaterial({color:0x00ff00, wireframe:true,}));

// Mouse 
const controls = new OrbitControls(cam, renderer.domElement);
window.addEventListener('resize', onWindowResize);

function onWindowResize(){
    width = window.innerWidth * 0.7;
    height = window.innerHeight * 0.7;
    cam.aspect = width / height;
    cam.updateProjectionMatrix();

    renderer.setSize(width, height);

    // Adjust layout of otherSpace div
    const offsetY = window.innerHeight - height;
    const offsetX = window.innerWidth - width;
    renderer.domElement.style.marginTop = offsetY / 2 + 'px';
    otherSpace.style.top = window.innerHeight * 0.01 + 'px';
    otherSpace.style.width = offsetX + 'px';
}

//#region Html
function convertColor(hex){
    hex = String(hex);
    hex = hex.replace('#', '');

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return new three.Color(r / 255, g / 255, b / 255);
}

function htmlValues(){
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
        cubeColor = convertColor(hexColor);
        // Update cube color
        cube.material.color.set(cubeColor);
    });
    // bg color
    backgroundColorPicker.addEventListener('input', function(){
        let hexColor = backgroundColorPicker.value;
        bgColor = convertColor(hexColor);
        // Update bg color
        scene.background = new three.Color(bgColor);
    });
    // plane color
    planeColorPicker.addEventListener('input', function(){
        let hexColor = planeColorPicker.value;
        planeColor = convertColor(hexColor);
        plane.material.color.set(planeColor);
    });
}
//#endregion

function setUp(){
    renderer.setSize(width, height);
    renderer.domElement.classList.add('cav');
    document.body.appendChild(renderer.domElement);

    //Controls
    controls.target.set(1, -1, -1);
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.update();

    // Scene
    cube.position.y = 1.5;
    Fisiks.addPhysicsTo(cube);
    scene.add(cube);

    Fisiks.makeCollidable(plane);
    scene.add(plane);

    scene.background = new three.Color(bgColor);
    scene.add(gridCube);

    // Style Canvas and other half of the website
    let offsetY = window.innerHeight - height;
    let offsetX = window.innerWidth - width;
    renderer.domElement.style.marginTop = offsetY / 2 + 'px';
    otherSpace.style.width  = offsetX + 'px';
    otherSpace.style.top = window.innerHeight * 0.01 + 'px';

    // Values
    cam.position.z = cameraDistance;
    plane.rotation.x = Math.PI / 2;
}

function ren(){

    // Update Controls
    controls.update();

    // Draw Rotation
    if(canRotate){
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

    Fisiks.update(scene);

    renderer.render(scene, cam);

    requestAnimationFrame(ren);
}

// Initialize html before setup();
htmlValues();
setUp();
ren();