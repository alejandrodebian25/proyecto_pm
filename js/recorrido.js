/*
*************************************************************************************************
 * VARIABLES
/************************************************************************************************
*/
var camera, scene, renderer;
var clock;

// ============================= Variables  par ael mapa

var mapaSize = 1000;

// ============================= variables para el personaje
// camara vista giratoria
var controles;
var controlesEnabled = false;
//Movimietos
var movAdelante = false;
var movAtras = false;
var movIzquierda = false;
var movDerecha = false;
// velocidad
var personajeVelocidad = new THREE.Vector3();
const VELOCIDAD = 800.0;


// ============================= variables para el DOM
var bloqueo = document.getElementById('bloqueo');

/*
*************************************************************************************************
 * funciones
/************************************************************************************************
*/

function init() {
    //----------------- Configuraciones Iniciales
    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.color = new THREE.Color(0xAED6F1);

    //  render configuraciones
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(scene.color);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //  HTML contenedor 
    var contenedor = document.getElementById('contenedor');
    contenedor.appendChild(renderer.domElement);

    //  camara posicion
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.y = 20; // Height the camera will be looking from
    camera.position.x = 0;
    camera.position.z = 0;

    scene.add(camera);

    controles = new THREE.PointerLockControls(camera);
    scene.add(controles.getObject());
    //----------------- fin Configuraciones Iniciales

    //----------------- llamada de funciones
    addLights();
    crearPiso();
    crearTecho();
    divMapa();
    listenPersonajeMovimiento();

}

// ============================= Luces

function addLights() {
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);
    var lightTwo = new THREE.DirectionalLight(0xffffff, .5);
    lightTwo.position.set(1, -1, -1);
    scene.add(lightTwo);

    var light = new THREE.PointLight(0xffffff, 1, 500);
    light.position.set(-20, 50, -170);
    scene.add(light);

}

// ============================= Piso
function crearPiso() {
    // Creaar piso geometria y material

    var pisoGeo = new THREE.PlaneGeometry(46 * 20, 39 * 20);

    // let loader = new THREE.TextureLoader();
    // const material = new THREE.MeshBasicMaterial({
    //     map: loader.load('images/romano.png'),
    // });
    var material2 = new THREE.MeshPhongMaterial({ color: 0xA0522D, side: THREE.DoubleSide });

    var piso = new THREE.Mesh(pisoGeo, material2);
    piso.material.side = THREE.DoubleSide;
    piso.position.set(0, 1, 0);
    // Rotamos el piso(plano) a 90grados
    piso.rotation.x = degreesToRadians(90);
    scene.add(piso);
}

function crearTecho() {
    var pisoGeo = new THREE.PlaneGeometry(46 * 20, 39 * 20);
    var material2 = new THREE.MeshPhongMaterial({ color: 0xFDEDEC, side: THREE.DoubleSide });

    var piso = new THREE.Mesh(pisoGeo, material2);
    // piso.material.side = THREE.DoubleSide;
    piso.position.set(0, 60, 0);
    // Rotamos el piso(plano) a 90grados
    piso.rotation.x = degreesToRadians(90);
    scene.add(piso);
}
// funcionde grados a radianes
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

// ============================= crear la division en el mapa para las casas
function divMapa() {
    const ancho = 20; //ancho y profundidad
    const alto = 20
    const mapa = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 9, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1],
    ];

    // geometria y metarial de la pared
    var paredGeoBaja = new THREE.BoxGeometry(ancho, alto, ancho);
    var paredGeoAlta = new THREE.BoxGeometry(ancho, alto * 2, ancho);
    var paredMat1 = new THREE.MeshPhongMaterial({
        color: 0xC0392B,
    });
    var paredMat2 = new THREE.MeshPhongMaterial({
        color: 0xFBEEE6,
    });

    // mat y geo de pasillo
    var pasilloGeo = new THREE.BoxGeometry(ancho, 2, ancho);

    var texture = new THREE.TextureLoader().load('images/pisopasillo.jpg');
    var pasilloMat = new THREE.MeshPhongMaterial({ map: texture });

    // mat y geo de piso madera
    var pisoMaderaGeo = new THREE.BoxGeometry(ancho, 2, ancho);
    var texturemadera = new THREE.TextureLoader().load('images/pisomadera.jpg');
    var pisoMaderaMat = new THREE.MeshPhongMaterial({ map: texturemadera });
    // el mapa sera dividido 

    const mapaFila = mapa.length;
    const mapaColumna = mapa[0].length;
    // mapaSize=mapaFila*mapaColumna;
    console.log("alto " + mapaFila + "ancho" + mapaColumna);

    for (var i = 0; i < mapaFila; i++) {
        for (var j = 0; j < mapaColumna; j++) {

            switch (mapa[i][j]) {
                case 1:

                    let paredbaja = new THREE.Mesh(paredGeoBaja, paredMat1);

                    paredbaja.position.x = (j - mapaColumna / 2) * ancho;
                    paredbaja.position.z = (i - mapaFila / 2) * ancho;
                    paredbaja.position.y = alto / 2;
                    // console.log("=>" + pared.position.x + " / " + pared.position.y + " / " + pared.position.z)
                    scene.add(paredbaja);
                    paredbaja.geometry.faces[5].color.setHex(0x00ff00);

                    let paredalta = new THREE.Mesh(paredGeoAlta, paredMat2);
                    paredalta.position.x = (j - mapaColumna / 2) * ancho;
                    paredalta.position.z = (i - mapaFila / 2) * ancho;
                    paredalta.position.y = ((alto * 2) / 2) + alto;

                    scene.add(paredalta);
                    break;
                case 2:
                    let pisoPasillo = new THREE.Mesh(pasilloGeo, pasilloMat);
                    pisoPasillo.position.x = (j - mapaColumna / 2) * ancho;
                    pisoPasillo.position.z = (i - mapaFila / 2) * ancho;
                    pisoPasillo.position.y = 2 / 2;
                    scene.add(pisoPasillo)
                    break;
                case 3:
                    let pisoMadera = new THREE.Mesh(pisoMaderaGeo, pisoMaderaMat);
                    pisoMadera.position.x = (j - mapaColumna / 2) * ancho;
                    pisoMadera.position.z = (i - mapaFila / 2) * ancho;
                    pisoMadera.position.y = 2 / 2;
                    scene.add(pisoMadera);
                    break;
            }


            if (mapa[i][j] == 9) {
                // referencia de possion
                console.log("i " + i + "  j " + j)
                console.log("x " + (j - mapaColumna / 2) * ancho + "  z " + (i - mapaFila / 2) * ancho)
            }


        }
    }

    paredInterior(20,60);
}
// ============================= escucha de teclas presionadas para el movimiento 
function listenPersonajeMovimiento() {
    // tecla presiopnada
    var onKeyDown = function (event) {
        switch (event.keyCode) {
            case 38: // fa
            case 87: // w
                movAdelante = true;
                break;
            case 37: // izq
            case 65: // a
                movIzquierda = true;
                break;
            case 40: // abajo
            case 83: // s
                movAtras = true;
                break;
            case 39: // dere
            case 68: // d
                movDerecha = true;
                break;
        }
    };

    // tecla deja da de presoinada
    var onKeyUp = function (event) {
        switch (event.keyCode) {
            case 38: // arriba
            case 87: // w
                movAdelante = false;
                break;
            case 37: // izq
            case 65: // a
                movIzquierda = false;
                break;
            case 40: // abajo
            case 83: // s
                movAtras = false;
                break;
            case 39: // der
            case 68: // d
                movDerecha = false;
                break;
        }
    };


    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
};

// moviendo al personaje (camara)
function animatePersonaje(delta) {
    // console.log(delta)

    personajeVelocidad.x -= personajeVelocidad.x * 10.0 * delta;
    personajeVelocidad.z -= personajeVelocidad.z * 10.0 * delta;
    // console.log("vx= "+personajeVelocidad.x * delta+ "vz ="+personajeVelocidad.z* delta)
    if (movAdelante) {
        personajeVelocidad.z -= VELOCIDAD * delta;
    }
    if (movAtras) {
        personajeVelocidad.z += VELOCIDAD * delta;
    }
    if (movIzquierda) {
        personajeVelocidad.x -= VELOCIDAD * delta;
    }
    if (movDerecha) {
        personajeVelocidad.x += VELOCIDAD * delta;
    }
    if (!(movAdelante || movAtras || movIzquierda || movDerecha)) {

        personajeVelocidad.x = 0;
        personajeVelocidad.z = 0;
    }
    controles.getObject().translateX(personajeVelocidad.x * delta);
    controles.getObject().translateZ(personajeVelocidad.z * delta);
}

// ============================= Desbloqueo

function getPointerLock() {
    document.onclick = function () {
        contenedor.requestPointerLock();
    }
    document.addEventListener('pointerlockchange', lockChange, false);
}
function lockChange() {
    if (document.pointerLockElement === contenedor) {
        // Oculta  blocker 
        bloqueo.style.display = "none";
        controles.enabled = true;

    } else {
        // Muestra blocker 
        bloqueo.style.display = "";
        controles.enabled = false;
    }
}

// ============================= Animacion

function render() {
    renderer.render(scene, camera);
}
function animate() {
    render();
    requestAnimationFrame(animate);

    var delta = clock.getDelta();
    animatePersonaje(delta);
}
/*
*************************************************************************************************
 * agregando objetos
/************************************************************************************************
*/
function paredInterior(ancho,alto) {
    let paredGeo = new THREE.BoxGeometry(ancho*12, alto, 1);
    let paredMat = new THREE.MeshBasicMaterial({
        color: 0xF9E79F,
        opacity: 0.5,
        transparent: true,
    });

    let paredInterior = new THREE.Mesh(paredGeo, paredMat);
    paredInterior.position.x = -10
    paredInterior.position.z = -170+10
    paredInterior.position.y = alto/2
    scene.add(paredInterior)

}

/*
*************************************************************************************************
 * lLAMADA DE funciones
/************************************************************************************************
*/

getPointerLock();
init();
animate();