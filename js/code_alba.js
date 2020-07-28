function silla_aa(x,z) {

    let obj;
    let loader = new THREE.JSONLoader();
    loader.load('js/alba/silamoderna.json', function (g, m) {// a
        const alto=30;// a
        const ancho =35;// a

        obj = new THREE.Mesh(g, m);
        obj.scale.set(ancho, alto,ancho);// a
        
        obj.position.x = x;// a
        obj.position.y =2;// a
        obj.position.z = z;// a

        obj.rotation.y= degreesToRadians(110);
        
        scene.add(obj);
    });
}