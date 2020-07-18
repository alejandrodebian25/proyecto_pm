function casa_aq() {

    let obj;
    let loader = new THREE.JSONLoader();
    loader.load('js/quea/casatres.json', function (g, m) {// a
        const alto=50;// a
        const ancho =22;// a

        obj = new THREE.Mesh(g, m);
        obj.scale.set(ancho, alto,ancho+20);// a
        
        obj.position.x = -400;// a
        obj.position.y = alto+10;// a
        obj.position.z = -400;// a
        
        scene.add(obj);
    });
}

function casa_bq() {

    let obj;
    let loader = new THREE.JSONLoader();
    loader.load('js/quea/casatres.json', function (g, m) {// a
        const alto=50;// a
        const ancho =22;// a

        obj = new THREE.Mesh(g, m);
        obj.scale.set(ancho, alto,ancho+20);// a
        
        obj.position.x = 100;// a
        obj.position.y = 1;// a
        obj.position.z = -300;// a
        
        scene.add(obj);
    });
}

function casa_cq() {

    let obj;
    let loader = new THREE.JSONLoader();
    loader.load('js/quea/casatres.json', function (g, m) {// a
        const alto=50;// a
        const ancho =22;// a

        obj = new THREE.Mesh(g, m);
        obj.scale.set(ancho, alto,ancho+20);// a
        
        obj.position.x = -400;// a
        obj.position.y = 1;// a
        obj.position.z = 200;// a
        
        scene.add(obj);
    });
}