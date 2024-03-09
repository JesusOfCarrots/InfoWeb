import * as THREE from 'three';

let FOV = 75;
let width = window.innerWidth * 0.7;
let height = window.innerHeight * 0.7;
let cameraDistance = 5;

let rotationSpeed = 0.02;
let canRotate = true;
let cubeColor = 0xffd700;

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 1000)

const otherSpace = document.getElementById('other');
const rotationSpeedSlider = document.getElementById('slider');
const rotateCheckbox = document.getElementById('rotateCheckbox');
const colorPicker = document.getElementById("colorPicker");

const renderer = new THREE.WebGLRenderer();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial( {color:cubeColor} );

const cube = new THREE.Mesh(geometry, material);

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


    // slider
    rotationSpeedSlider.addEventListener('input', () => {
        rotationSpeed = parseFloat(rotationSpeedSlider.value);
        document.getElementById('sliderValue').textContent = rotationSpeed.toFixed(2);
    })

    // checkbox
    rotateCheckbox.addEventListener("click", updateCheckBox);

    // color
    colorPicker.addEventListener('input', function(){
        let hexColor = colorPicker.value
        cubeColor = hexToRgb(hexColor);
        // Update cube color
        cube.material.color.set(cubeColor);
    });

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