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
    divMapa();
    listenPersonajeMovimiento();
    agregandoCasas()
}

// ============================= Luces

function addLights() {
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

}

// ============================= Piso
function crearPiso() {
    // Creaar piso geometria y material

    var pisoGeo = new THREE.PlaneGeometry(mapaSize, mapaSize);

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
// funcionde grados a radianes
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

// ============================= crear la division en el mapa para las casas
function divMapa() {
    const ancho = 100; //ancho y profundidad

    const mapa = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 0, 0, 0, 0]
    ];
    var espacioGeo = new THREE.BoxGeometry(ancho, 1, ancho);
    var espacioMatangi = new THREE.MeshPhongMaterial({
        color: 0xC39BD3,
    });
    var espacioMatale = new THREE.MeshPhongMaterial({
        color: 0xD6DBDF,
    });
    var espacioMatwil = new THREE.MeshPhongMaterial({
        color: 0x28B463,
    });
    // el mapa sera dividido en 10x10
    let id = "";
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {

            if (mapa[i][j]) {

                if (j == 1) {
                    var espacio = new THREE.Mesh(espacioGeo, espacioMatangi);
                    id = "angi";
                }
                if (j == 3) {
                    var espacio = new THREE.Mesh(espacioGeo, espacioMatale);
                    id = "ale";
                }
                if (j == 6) {
                    var espacio = new THREE.Mesh(espacioGeo, espacioMatwil);
                    id = "wil";
                }
                if (j == 8) {
                    var espacio = new THREE.Mesh(espacioGeo, espacioMatale);
                    id = "sa";
                }

                espacio.position.x = (j - 10 / 2) * ancho;
                espacio.position.z = (i - 10 / 2) * ancho;
                espacio.position.y = 1;
                console.log(id + "=>" + espacio.position.x + " / " + espacio.position.y + " / " + espacio.position.z)
                scene.add(espacio);
            }
        }
    }

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
 * agregando casas
/************************************************************************************************
*/

function agregandoCasas(){
    // casas de alejandro q
    // casa_aq();
    // casa_bq();
    // casa_cq();
    // casas de aNGI q

    // casas de wilder q


}





/*
*************************************************************************************************
 * lLAMADA DE funciones
/************************************************************************************************
*/

getPointerLock();
init();
animate();