function silla_am(x,z) {

    let obj;
    let loader = new THREE.JSONLoader();
    loader.load('js/mamani/silla.json', function (g, m) {// a
        const alto=15;// a
        const ancho =20;// a

        obj = new THREE.Mesh(g, m);
        obj.scale.set(ancho, alto,ancho);// a
        
        obj.position.x = x+10;// a
        obj.position.y =15/2;// a
        obj.position.z = z+10;// a

        obj.rotation.y= degreesToRadians(270);
        
        scene.add(obj);
    });
}