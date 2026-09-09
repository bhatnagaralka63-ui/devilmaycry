function createWorld() {

    // Scene background
    scene.background = new THREE.Color(0x0d0d12);

    // Fog
    scene.fog = new THREE.Fog(0x0d0d12, 20, 120);

    // Ambient Light
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    // Directional Light
    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(10, 20, 10);

    sun.castShadow = true;

    scene.add(sun);

    // Ground
    const floor = new THREE.Mesh(

        new THREE.PlaneGeometry(200, 200),

        new THREE.MeshStandardMaterial({
            color: 0x444444
        })

    );

    floor.rotation.x = -Math.PI / 2;

    floor.receiveShadow = true;

    scene.add(floor);

    // Grid
    const grid = new THREE.GridHelper(200, 100);

    scene.add(grid);

}