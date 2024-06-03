import * as three from 'three';                                         // Importieren der Bibleothek 'three.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'; // Importieren der Maus steuerung 'OrbitControls'

// General
let FOV = 75;
let cameraDistance = 5;
let width = window.innerWidth * 0.7;
let height = window.innerHeight * 0.7;

let bgColor = 0x0000;

// Erstellung der Szenen, Kamera und renderer konstanten
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
// Referenz zu html
const cubeX = document.getElementById('cubeX');
const cubeY = document.getElementById('cubeY');
const cubeZ = document.getElementById('cubeZ');

const rotationSpeedSlider = document.getElementById('slider');
const rotateCheckbox = document.getElementById('rotateCheckbox');
const cubeSizeSlider = document.getElementById('cubeSizeSlider');
const colorPicker = document.getElementById("colorPicker");

// Die konstanten für den Würfel
const geometry = new three.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new three.MeshBasicMaterial( {color:cubeColor} );
const cube = new three.Mesh(geometry, material);

// Plane
// Texture laden
const textureLoader = new three.TextureLoader();
const planeTexture = textureLoader.load('textures/wall.png');

// Notwenige konstanten für den Boden
const planeGeometry = new three.BoxGeometry(10, 5, 1);
const planeMaterial = new three.MeshBasicMaterial( {map:planeTexture});
const plane = new three.Mesh(planeGeometry, planeMaterial);

// Grid
let showGrid = true;
let gridSize = 30;

// Referenzen zu den Html elementen
const gridCheckBox = document.getElementById('gridCheck');
const gridSizeSlider = document.getElementById('gridSizeSlider');

const gridCube = new three.Mesh(new three.BoxGeometry(30, 30, 30, 10, 10, 10), new three.MeshBasicMaterial({color:0x00ff00, wireframe:true,}));

// Konstante für die Steuerung der Maus 
const controls = new OrbitControls(cam, renderer.domElement);

// Hier wird auf das Event, wo die größe des Fensters geändert wird, gehört
window.addEventListener('resize', onWindowResize);

// Eine Funktion, die auf das Event 'resize' hört und dann ausgeführt wird
function onWindowResize(){
    // Die Höhe und Breite wird neu berechnet
    width = window.innerWidth * 0.7;
    height = window.innerHeight * 0.7;
    // Die Einstellung der Kamera wird angepasst
    cam.aspect = width / height;
    cam.updateProjectionMatrix();

    // Es wird neu gerendert
    renderer.setSize(width, height);

    // Hier wird alles andere auf der html site außer die Szene mit css angepasst
    const offsetY = window.innerHeight - height;
    const offsetX = window.innerWidth - width;
    renderer.domElement.style.marginTop = offsetY / 2 + 'px';
    otherSpace.style.top = window.innerHeight * 0.01 + 'px';
    otherSpace.style.width = offsetX + 'px';
}

// Die Aussgabe von dem Colorpicker ist nicht kompatibel mit den Farben von three.js
function convertColor(hex){
    // Sicherstellen, dass der Parameter ein String ist.
    hex = String(hex);
    // # Mit nichts ersätzen
    hex = hex.replace('#', '');

    // Die einzelnen Werte der Farben umwandeln
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    // Die Fertige farbe ausgeben
    return new three.Color(r / 255, g / 255, b / 255);
}

// Die Funktion behandelt alle referenzen aus dem html dokument
// Es wird parktisch immer an das Element ein EventListener hinzugefügt. Dieser achtet dann auf ein bestimmtes Event, wie 'change', 'input', etc
// und hängt an dieses Event eine function
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
}

function setUp(){
    // Es wird der Renderer konfiguriert
    renderer.setSize(width, height);
    // An das html Element, dass der Renderer erstellt wird die classe 'cav' gehängt
    renderer.domElement.classList.add('cav');
    document.body.appendChild(renderer.domElement);

    //Controls
    // Die Einstellungen für die Maus steuerung
    controls.target.set(1, -1, -1);
    // Erlaubt es zu zoomen
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.update();

    // Scene
    // Der Würfel wird hinzugefügt und mit standart Werten versehen
    cube.position.y = 1.5;
    scene.add(cube);

    // Der Boden wird hinzugefügt und mit standart Werten versehen
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    scene.background = new three.Color(bgColor);
    scene.add(gridCube);

    // Css styling
    let offsetY = window.innerHeight - height;
    let offsetX = window.innerWidth - width;
    renderer.domElement.style.marginTop = offsetY / 2 + 'px';
    otherSpace.style.width  = offsetX + 'px';
    otherSpace.style.top = window.innerHeight * 0.01 + 'px';

    // Die Position der Camera 
    cam.position.z = cameraDistance;
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

    // 30 oder 60 mal in der Sekunde werden die Animationen gerendert also gezeichnet
    cam.updateProjectionMatrix();
    renderer.render(scene, cam);
    requestAnimationFrame(ren);
}


htmlValues();
setUp();
ren();