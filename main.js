import * as THREE from 'three';

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
const rotationSpeedSlider = document.getElementById('slider');
const camDistanceSlider = document.getElementById('camDistanceSlider');
const cubeSizeSlider = document.getElementById('cubeSizeSlider');
const rotateCheckbox = document.getElementById('rotateCheckbox');
const colorPicker = document.getElementById("colorPicker");
const backgroundColorPicker = document.getElementById("gbColor");

// Cube pos
const cubeX = document.getElementById('cubeX');
const cubeY = document.getElementById('cubeY');
const cubeZ = document.getElementById('cubeZ');

const renderer = new THREE.WebGLRenderer();
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshBasicMaterial( {color:cubeColor} );

const cube = new THREE.Mesh(geometry, material);

// Mouse
let isDraging = false;
let previousMousePos = {
    x: 0,
    y: 0
};
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('mouseup', onMouseUp, false);
document.addEventListener('wheel', onMouseWheel, false);

function updateCheckBox(){
    canRotate = rotateCheckbox.checked;
    console.log(canRotate);
}

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
    console.log(cubeX.value, cubeY.value, cubeZ.value);
}

function getHtmlValues(){
    // rotation slider
    rotationSpeedSlider.addEventListener('input', () => {
        rotationSpeed = parseFloat(rotationSpeedSlider.value);
        document.getElementById('sliderValue').textContent = rotationSpeed.toFixed(2);
    });

    // distance slider
    camDistanceSlider.addEventListener('input', () => {
        cameraDistance = parseFloat(camDistanceSlider.value);
        document.getElementById('camDistanceSliderValue').textContent = cameraDistance.toFixed(2);
        cam.position.z = cameraDistance;
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
    rotateCheckbox.addEventListener("click", updateCheckBox);

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
//#region Mouse Input
function onMouseDown(event){
    isDraging = true;
    previousMousePos = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseMove(event){
    if (isDraging){
        let deltaMove = {
            x: event.clientX - previousMousePos.x,
            y: event.clientY - previousMousePos.y
        };

        rotateCam(deltaMove);

        previousMousePos = {
            x: event.clientX,
            y: event.clientY
        };
    }
}

function onMouseUp(event){ isDraging = false; }

function rotateCam(deltaMove){
    let deltaRotationQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(
            toRadians(deltaMove.y * 0.3),
            toRadians(deltaMove.x * 0.3),
            0,
            'XYZ'
        ));
    cam.quaternion.multiplyQuaternions(deltaRotationQuaternion, cam.quaternion);
}

function toRadians(degrees){ return degrees * (Math.PI / 180); }

function onMouseWheel(event){
    if(event.deltaY > 0){
        cam.position.z++;
        document.getElementById('camDistanceSliderValue').textContent = cam.position.z.toFixed(2);
    }
    else{
        cam.position.z--;
        document.getElementById('camDistanceSliderValue').textContent = cam.position.z.toFixed(2);
    }
}

//#endregion

function setUp(){
    renderer.setSize(width, height);
    renderer.domElement.classList.add('cav');
    document.body.appendChild(renderer.domElement);

    scene.background = new THREE.Color(bgColor);
    scene.add(cube);
    // Center
    let offsetY = window.innerHeight - height;
    let offsetX = window.innerWidth - width;
    renderer.domElement.style.marginTop = offsetY / 2 + 'px';
    otherSpace.style.width  = offsetX + 'px';
    otherSpace.style.top = window.innerHeight * 0.3 + 'px';

    getHtmlValues();

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