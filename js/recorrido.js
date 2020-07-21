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

    agregarObjetos();

}

// ============================= Luces

function addLights() {
    // var light = new THREE.DirectionalLight(0xffffff);
    // light.position.set(1, 1, 1);
    // scene.add(light);
    // var lightTwo = new THREE.DirectionalLight(0xffffff, .5);
    // lightTwo.position.set(1, -1, -1);
    // scene.add(lightTwo);
    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);
    foco(240, 190);
    foco(-100, -90);
    foco(160, -90);
    foco(120, -250);
    foco(-40, -270);

    foco(-360, -270);
    foco(-220, -270);
    foco(-400, 50);
    foco(-220, 50);


}
function foco(x, z) {
    var light = new THREE.PointLight(0xffffff, 1, 200);
    light.position.set(x, 50, z);
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
        [1, 1, 4, 4, 1, 4, 4, 1, 1, 4, 4, 1, 4, 4, 1, 1, 1, 1, 4, 4, 1, 4, 4, 1, 1, 4, 4, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 5, 6, 6, 6, 6, 6, 6, 5, 6, 6, 6, 6, 6, 6, 5, 1, 5, 3, 3, 3, 3, 3, 5, 5, 3, 3, 3, 3, 3, 3, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 1, 5, 3, 3, 3, 3, 3, 5, 5, 3, 3, 3, 3, 3, 3, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 5, 6, 6, 6, 1, 6, 6, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 4, 4, 4, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 5, 6, 6, 6, 6, 6, 6, 5, 6, 6, 6, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 5, 6, 6, 6, 6, 6, 6, 5, 6, 6, 6, 6, 6, 6, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 4, 4, 1, 4, 4, 1, 1, 4, 1, 4, 4, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1],
    ];

    // geometria y metarial de la pared
    var paredGeoBaja = new THREE.BoxGeometry(ancho, alto, ancho);
    var paredGeoAlta = new THREE.BoxGeometry(ancho, alto * 2, ancho);
    // geometria y metarial de la pared con ventana
    var paredGeoAltaVen = new THREE.BoxGeometry(ancho, alto / 2, ancho);
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

    // bloque Interiror
    var bloqueGeo = new THREE.BoxGeometry(ancho, alto * 3, ancho);
    var bloqueMat = new THREE.MeshPhongMaterial({
        color: 0xF1C40F,
    });
    // mat y geo de pasillo
    var pisoaulaGeo = new THREE.BoxGeometry(ancho, 2, ancho);
    var textureaula = new THREE.TextureLoader().load('images/pisoaula.png');
    var pisoaulaMat = new THREE.MeshPhongMaterial({ map: textureaula });

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
                case 4:
                    let paredbaja2 = new THREE.Mesh(paredGeoBaja, paredMat1);

                    paredbaja2.position.x = (j - mapaColumna / 2) * ancho;
                    paredbaja2.position.z = (i - mapaFila / 2) * ancho;
                    paredbaja2.position.y = alto / 2;
                    // console.log("=>" + pared.position.x + " / " + pared.position.y + " / " + pared.position.z)
                    scene.add(paredbaja2);

                    let paredalta2 = new THREE.Mesh(paredGeoAltaVen, paredMat2);
                    paredalta2.position.x = (j - mapaColumna / 2) * ancho;
                    paredalta2.position.z = (i - mapaFila / 2) * ancho;
                    paredalta2.position.y = ((10 * 1) / 2) + alto;

                    scene.add(paredalta2);
                    break;
                case 5:
                    let bloqueInterior = new THREE.Mesh(bloqueGeo, bloqueMat);

                    bloqueInterior.position.x = (j - mapaColumna / 2) * ancho;
                    bloqueInterior.position.z = (i - mapaFila / 2) * ancho;
                    bloqueInterior.position.y = (alto * 3) / 2;
                    // console.log("=>" + pared.position.x + " / " + pared.position.y + " / " + pared.position.z)
                    scene.add(bloqueInterior);
                    break;

                case 6:
                    let pisoaula = new THREE.Mesh(pisoaulaGeo, pisoaulaMat);
                    pisoaula.position.x = (j - mapaColumna / 2) * ancho;
                    pisoaula.position.z = (i - mapaFila / 2) * ancho;
                    pisoaula.position.y = 2 / 2;
                    scene.add(pisoaula);
                    break;
            }


            if (mapa[i][j] == 9) {
                // referencia de possion
                // console.log("i " + i + "  j " + j)
                console.log("x " + (j - mapaColumna / 2) * ancho + "  z " + (i - mapaFila / 2) * ancho)
            }


        }
    }

    paredInterior(20, 60);
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
function paredInterior(ancho, alto) {
    let paredGeo = new THREE.BoxGeometry(20 * 12, 20, 1);
    let paredMat = new THREE.MeshPhongMaterial({
        color: 0xF9E79F,
        // opacity: 0.5,
        // transparent: true,
    });

    let paredInterior11 = new THREE.Mesh(paredGeo, paredMat);
    paredInterior11.position.x = -10
    paredInterior11.position.z = -170 + 10
    paredInterior11.position.y = 20 / 2
    scene.add(paredInterior11)

    let paredGeo12 = new THREE.BoxGeometry(20 * 13, 20, 1);
    let paredInterior12 = new THREE.Mesh(paredGeo12, paredMat);
    paredInterior12.position.x = 20
    paredInterior12.position.z = -380
    paredInterior12.position.y = 20 / 2
    scene.add(paredInterior12)

    let paredGeo13 = new THREE.BoxGeometry(1, 20, 20 * 9);
    let paredInterior13 = new THREE.Mesh(paredGeo13, paredMat);
    paredInterior13.position.x = -130
    paredInterior13.position.z = -270
    paredInterior13.position.y = 20 / 2
    scene.add(paredInterior13)

    // let paredGeo14 = new THREE.BoxGeometry(1, 20, 20*9);
    let paredInterior14 = new THREE.Mesh(paredGeo13, paredMat);
    paredInterior14.position.x = 160 + 10
    paredInterior14.position.z = -270
    paredInterior14.position.y = 20 / 2
    scene.add(paredInterior14)

    crearParedInterior(20 * 13, 0.5, -300, -380);
    crearParedInterior(20 * 10, 0.5, -330, -100);
    crearParedInterior(0.5, 20 * 12, -450, -240);
    crearParedInterior(0.5, 20 * 9, -150, -270);

    crearParedInterior(20 * 10, 0.5, -330, -80);
    crearParedInterior(20 * 13, 0.5, -300, 200);
    crearParedInterior(0.5, 20 * 12, -450, 60);
    crearParedInterior(0.5, 20 * 9, -150, 90);


}
function crearParedInterior(ancho, grosor, x, z) {
    let paredGeo = new THREE.BoxGeometry(ancho, 20, grosor);
    let paredMat = new THREE.MeshPhongMaterial({ color: 0xF9E79F, });
    let paredInterior = new THREE.Mesh(paredGeo, paredMat);
    paredInterior.position.x = x
    paredInterior.position.z = z
    paredInterior.position.y = 20 / 2
    scene.add(paredInterior)


}
function tarimas() {
    crearTarima(30, 20 * 8, -120, -270)
    crearTarima(30, 20 * 8, -440, -230)
    crearTarima(30, 20 * 8, -440, 70)
}
function crearTarima(ancho, grosor, x, z) {
    let tarimaGeo = new THREE.BoxGeometry(ancho, 16, grosor);
    let tarimaMat = new THREE.MeshPhongMaterial({ color: 0x784212, });
    let tarima = new THREE.Mesh(tarimaGeo, tarimaMat);
    tarima.position.x = x
    tarima.position.z = z
    tarima.position.y = 16 / 2
    scene.add(tarima)

}
function puertaAscensor() {

    let texture = new THREE.TextureLoader().load('images/ascensor.png');
    let mat = new THREE.MeshPhongMaterial({ map: texture });
    let geo = new THREE.BoxGeometry(1, 50, 20 * 2);

    let ascensoruno = new THREE.Mesh(geo, mat);
    ascensoruno.position.x = 350
    ascensoruno.position.z = 260
    ascensoruno.position.y = 50 / 2
    scene.add(ascensoruno)

    let geo2 = new THREE.BoxGeometry(20 * 2, 50, 1);
    let ascensordos = new THREE.Mesh(geo2, mat);
    ascensordos.position.x = 250
    ascensordos.position.z = 360
    ascensordos.position.y = 50 / 2
    scene.add(ascensordos)

}
function puertas() {

    let texture = new THREE.TextureLoader().load('images/dospuertas.png');
    let mat = new THREE.MeshPhongMaterial({ map: texture });
    let geo = new THREE.BoxGeometry(1, 50, 20 * 3);

    let dospuertas = new THREE.Mesh(geo, mat);
    dospuertas.position.x = 180
    dospuertas.position.z = 270
    dospuertas.position.y = 50 / 2
    scene.add(dospuertas)

    // unapuerta 
    let texture2 = new THREE.TextureLoader().load('images/puerta2.png');
    let mat2 = new THREE.MeshPhongMaterial({ map: texture2 });
    let geo2 = new THREE.BoxGeometry(1, 50, 20 * 1);

    let puerta = new THREE.Mesh(geo2, mat2);
    puerta.position.x = 290
    puerta.position.z = 190
    puerta.position.y = 50 / 2
    scene.add(puerta)

    // 
    let geo3 = new THREE.BoxGeometry(20 * 1, 50, 1);

    let puerta1 = new THREE.Mesh(geo3, mat2);
    puerta1.position.x = 240
    puerta1.position.z = -140
    puerta1.position.y = 50 / 2
    scene.add(puerta1)
    // 

    let puerta2 = new THREE.Mesh(geo3, mat2);
    puerta2.position.x = 120
    puerta2.position.z = -150
    puerta2.position.y = 50 / 2
    scene.add(puerta2)


    let puerta22 = new THREE.Mesh(geo3, mat2);
    puerta22.position.x = 150
    puerta22.position.z = -160
    puerta22.position.y = 50 / 2
    puerta22.rotation.y = degreesToRadians(90);
    scene.add(puerta22)
    
    crearPuerta(20,2,-200,-150);
    crearPuerta(2,20,-170,-160);
    
    crearPuerta(2,20,-210,-20);
    crearPuerta(20,2,-180,-30);
    
    crearPuerta(20,2,0,-30);

}
function crearPuerta(ancho,grosor,x,z){
    let texture = new THREE.TextureLoader().load('images/puerta2.png');
    let mat = new THREE.MeshPhongMaterial({ map: texture});
    let geo = new THREE.BoxGeometry(ancho, 50, grosor);

    let puerta = new THREE.Mesh(geo, mat);
    puerta.position.x = x
    puerta.position.z = z
    puerta.position.y = 50 / 2
    scene.add(puerta)
}

function ventanas() {
    let texture = new THREE.TextureLoader().load('images/ventanapas.png');
    let mat = new THREE.MeshPhongMaterial({
        map: texture, opacity: 0.9,
        transparent: true,
    });
    let geo = new THREE.BoxGeometry(20 * 3, 30, 20);

    let ventanapas = new THREE.Mesh(geo, mat);
    ventanapas.position.x = -80
    ventanapas.position.z = -150
    ventanapas.position.y = 45
    scene.add(ventanapas)
    let ventanapas2 = new THREE.Mesh(geo, mat);
    ventanapas2.position.x = 60
    ventanapas2.position.z = -150
    ventanapas2.position.y = 45
    scene.add(ventanapas2)



}
function persianas() {
    let texture = new THREE.TextureLoader().load('images/persiana.png');
    let mat = new THREE.MeshPhongMaterial({
        map: texture, opacity: 0.9,
        transparent: true,
    });
    let geo = new THREE.BoxGeometry(20 * 2, 30, 20);

    let persiana11 = new THREE.Mesh(geo, mat);
    persiana11.position.x = -90
    persiana11.position.z = -390
    persiana11.position.y = 45
    scene.add(persiana11)

    let persiana12 = new THREE.Mesh(geo, mat);
    persiana12.position.x = -30
    persiana12.position.z = -390
    persiana12.position.y = 45
    scene.add(persiana12)

    let persiana13 = new THREE.Mesh(geo, mat);
    persiana13.position.x = 50
    persiana13.position.z = -390
    persiana13.position.y = 45
    scene.add(persiana13)

    let persiana14 = new THREE.Mesh(geo, mat);
    persiana14.position.x = 110
    persiana14.position.z = -390
    persiana14.position.y = 45
    scene.add(persiana14)
    crearPersiana(20 * 2, -410, -390);
    crearPersiana(20 * 2, -350, -390);
    crearPersiana(20 * 2, -270, -390);
    crearPersiana(20 * 2, -210, -390);

    crearPersiana(20 * 2, -390, 210);
    crearPersiana(20 * 2, -330, 210);
    crearPersiana(20 * 1, -260, 210);
    crearPersiana(20 * 2, -210, 210);

}
function crearPersiana(ancho, x, z) {
    let texture = new THREE.TextureLoader().load('images/persiana.png');
    let mat = new THREE.MeshPhongMaterial({
        map: texture, opacity: 0.9,
        transparent: true,
    });
    let geo = new THREE.BoxGeometry(ancho, 30, 20);

    let persiana = new THREE.Mesh(geo, mat);
    persiana.position.x = x
    persiana.position.z = z
    persiana.position.y = 45
    scene.add(persiana)

}
function agregarObjetos() {
    puertaAscensor();
    puertas();
    ventanas();
    persianas();
    tarimas();
}
/*
*************************************************************************************************
 * lLAMADA DE funciones
/************************************************************************************************
*/

getPointerLock();
init();
animate();