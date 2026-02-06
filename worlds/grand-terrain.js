// Shared grand terrain: ground, mountains, trees, 6 altitude layers
// Used by all grand/float world plugins

export function createGrandTerrain(THREE, group, options = {}) {
    const showGround = options.showGround !== false;
    const showTrees = options.showTrees !== false;

    // Expanded ground
    if (showGround) {
        const grandGround = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 200),
            new THREE.MeshStandardMaterial({ color: 0x3d6b35, roughness: 0.9 })
        );
        grandGround.rotation.x = -Math.PI / 2;
        grandGround.position.y = -0.5;
        grandGround.receiveShadow = true;
        group.add(grandGround);
    }

    // Distant mountains on the horizon
    function createMountain(x, z, height, width) {
        const mountainGeo = new THREE.ConeGeometry(width, height, 6);
        const mountainMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, roughness: 0.9 });
        const mountain = new THREE.Mesh(mountainGeo, mountainMat);
        mountain.position.set(x, height / 2 - 0.5, z);

        const snowGeo = new THREE.ConeGeometry(width * 0.4, height * 0.3, 6);
        const snowMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const snow = new THREE.Mesh(snowGeo, snowMat);
        snow.position.y = height * 0.35;
        mountain.add(snow);
        return mountain;
    }

    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const dist = 60 + Math.random() * 20;
        group.add(createMountain(
            Math.cos(angle) * dist,
            Math.sin(angle) * dist,
            15 + Math.random() * 20,
            8 + Math.random() * 6
        ));
    }

    // Trees scattered on ground
    if (showTrees) {
        function createGrandTree(x, z) {
            const tree = new THREE.Group();
            const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.5, 4, 8),
                new THREE.MeshStandardMaterial({ color: 0x5c4033 })
            );
            trunk.position.y = 2;
            tree.add(trunk);

            const canopy = new THREE.Mesh(
                new THREE.ConeGeometry(2.5, 5, 8),
                new THREE.MeshStandardMaterial({ color: 0x2d5a27 })
            );
            canopy.position.y = 5.5;
            tree.add(canopy);

            tree.position.set(x, 0, z);
            return tree;
        }

        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 10 + Math.random() * 40;
            group.add(createGrandTree(
                Math.cos(angle) * dist,
                Math.sin(angle) * dist
            ));
        }
    }

    // ALTITUDE LAYERS

    // Layer 1: Low clouds (height 20-40)
    const lowClouds = [];
    function createCloud(y, scale) {
        const cloud = new THREE.Group();
        const cloudMat = new THREE.MeshStandardMaterial({
            color: 0xffffff, roughness: 1, transparent: true, opacity: 0.9,
        });
        for (let i = 0; i < 5 + Math.random() * 5; i++) {
            const puff = new THREE.Mesh(
                new THREE.SphereGeometry(1 + Math.random(), 8, 6),
                cloudMat
            );
            puff.position.set(
                (Math.random() - 0.5) * 3 * scale,
                (Math.random() - 0.5) * 0.8 * scale,
                (Math.random() - 0.5) * 2 * scale
            );
            puff.scale.setScalar(scale);
            cloud.add(puff);
        }
        cloud.position.y = y;
        cloud.userData = {
            baseX: (Math.random() - 0.5) * 80,
            baseZ: (Math.random() - 0.5) * 80,
            driftSpeed: 0.5 + Math.random() * 0.5,
            driftPhase: Math.random() * Math.PI * 2,
        };
        cloud.position.x = cloud.userData.baseX;
        cloud.position.z = cloud.userData.baseZ;
        return cloud;
    }

    for (let i = 0; i < 20; i++) {
        const cloud = createCloud(20 + Math.random() * 20, 1 + Math.random());
        lowClouds.push(cloud);
        group.add(cloud);
    }

    // Layer 2: Flying birds (height 30-60)
    const grandBirds = [];
    function createGrandBird() {
        const bird = new THREE.Group();
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const body = new THREE.Mesh(
            new THREE.ConeGeometry(0.2, 1, 6),
            bodyMat
        );
        body.rotation.z = Math.PI / 2;
        bird.add(body);

        const wingMat = new THREE.MeshStandardMaterial({ color: 0x444444, side: THREE.DoubleSide });
        const wingGeo = new THREE.PlaneGeometry(1.5, 0.4);
        const leftWing = new THREE.Mesh(wingGeo, wingMat);
        leftWing.position.set(0, 0.1, 0);
        bird.add(leftWing);

        bird.userData = {
            leftWing,
            baseY: 30 + Math.random() * 30,
            circleRadius: 10 + Math.random() * 20,
            circleSpeed: 0.2 + Math.random() * 0.2,
            phase: Math.random() * Math.PI * 2,
        };
        return bird;
    }

    for (let i = 0; i < 15; i++) {
        const bird = createGrandBird();
        grandBirds.push(bird);
        group.add(bird);
    }

    // Layer 3: Floating islands (height 50-100)
    const floatingIslands = [];
    function createFloatingIsland(y) {
        const island = new THREE.Group();

        const rockGeo = new THREE.IcosahedronGeometry(3 + Math.random() * 2, 1);
        const positions = rockGeo.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            if (positions[i + 1] < 0) positions[i + 1] *= 1.5;
            positions[i] += (Math.random() - 0.5) * 0.5;
            positions[i + 2] += (Math.random() - 0.5) * 0.5;
        }
        rockGeo.computeVertexNormals();

        const rock = new THREE.Mesh(rockGeo, new THREE.MeshStandardMaterial({
            color: 0x6b5344, roughness: 0.9,
        }));
        island.add(rock);

        const grassTop = new THREE.Mesh(
            new THREE.CylinderGeometry(2.5, 3, 0.5, 12),
            new THREE.MeshStandardMaterial({ color: 0x4a9f4d })
        );
        grassTop.position.y = 1.5;
        island.add(grassTop);

        for (let i = 0; i < 2 + Math.random() * 3; i++) {
            const miniTree = new THREE.Group();
            const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.1, 0.15, 1, 6),
                new THREE.MeshStandardMaterial({ color: 0x5c4033 })
            );
            trunk.position.y = 0.5;
            miniTree.add(trunk);

            const leaves = new THREE.Mesh(
                new THREE.ConeGeometry(0.6, 1.2, 6),
                new THREE.MeshStandardMaterial({ color: 0x2d5a27 })
            );
            leaves.position.y = 1.3;
            miniTree.add(leaves);

            miniTree.position.set(
                (Math.random() - 0.5) * 3, 1.7, (Math.random() - 0.5) * 3
            );
            island.add(miniTree);
        }

        if (Math.random() > 0.5) {
            const waterfall = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.5, 8, 8),
                new THREE.MeshStandardMaterial({
                    color: 0x88ccff, transparent: true, opacity: 0.6,
                })
            );
            waterfall.position.set(2, -3, 0);
            island.add(waterfall);
        }

        island.position.y = y;
        island.position.x = (Math.random() - 0.5) * 60;
        island.position.z = (Math.random() - 0.5) * 60;
        island.userData = {
            baseY: y,
            bobSpeed: 0.2 + Math.random() * 0.1,
            bobPhase: Math.random() * Math.PI * 2,
            rotateSpeed: 0.05 + Math.random() * 0.05,
        };
        return island;
    }

    for (let i = 0; i < 8; i++) {
        const island = createFloatingIsland(50 + Math.random() * 50);
        floatingIslands.push(island);
        group.add(island);
    }

    // Layer 4: High clouds / mist (height 80-120)
    const highClouds = [];
    for (let i = 0; i < 15; i++) {
        const cloud = createCloud(80 + Math.random() * 40, 2 + Math.random() * 2);
        cloud.children.forEach(puff => {
            puff.material = puff.material.clone();
            puff.material.opacity = 0.5;
        });
        highClouds.push(cloud);
        group.add(cloud);
    }

    // Layer 5: Aurora / ethereal lights (height 120-180)
    const auroraLights = [];
    const auroraMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88, transparent: true, opacity: 0.3, side: THREE.DoubleSide,
    });

    for (let i = 0; i < 6; i++) {
        const auroraGeo = new THREE.PlaneGeometry(30, 20, 10, 10);
        const aurora = new THREE.Mesh(auroraGeo, auroraMaterial.clone());
        aurora.material.color.setHSL(0.3 + Math.random() * 0.4, 0.8, 0.5);
        aurora.position.set(
            (Math.random() - 0.5) * 80,
            130 + Math.random() * 40,
            (Math.random() - 0.5) * 80
        );
        aurora.rotation.y = Math.random() * Math.PI;
        aurora.userData = {
            waveSpeed: 0.5 + Math.random() * 0.5,
            wavePhase: Math.random() * Math.PI * 2,
        };
        auroraLights.push(aurora);
        group.add(aurora);
    }

    // Layer 6: Stars / space (height 150+)
    const stars = [];
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 200; i++) {
        const star = new THREE.Mesh(
            new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 4, 4),
            starMaterial.clone()
        );
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 100;
        star.position.set(
            Math.cos(angle) * dist,
            160 + Math.random() * 100,
            Math.sin(angle) * dist
        );
        star.userData = {
            twinkleSpeed: 2 + Math.random() * 3,
            twinklePhase: Math.random() * Math.PI * 2,
        };
        stars.push(star);
        group.add(star);
    }

    return { lowClouds, highClouds, grandBirds, floatingIslands, auroraLights, stars };
}

export function animateGrandTerrain(state, time, deltaTime) {
    const { lowClouds, highClouds, grandBirds, floatingIslands, auroraLights, stars } = state;

    // Clouds drifting
    [...lowClouds, ...highClouds].forEach(cloud => {
        const c = cloud.userData;
        cloud.position.x = c.baseX + Math.sin(time * c.driftSpeed * 0.1 + c.driftPhase) * 10;
        cloud.position.z = c.baseZ + Math.cos(time * c.driftSpeed * 0.1 + c.driftPhase) * 5;
    });

    // Grand birds circling
    grandBirds.forEach(bird => {
        const b = bird.userData;
        const angle = time * b.circleSpeed + b.phase;
        bird.position.x = Math.cos(angle) * b.circleRadius;
        bird.position.z = Math.sin(angle) * b.circleRadius;
        bird.position.y = b.baseY + Math.sin(time + b.phase) * 2;
        bird.rotation.y = -angle + Math.PI / 2;
        b.leftWing.rotation.x = Math.sin(time * 4) * 0.4;
    });

    // Floating islands bobbing
    floatingIslands.forEach(island => {
        const i = island.userData;
        island.position.y = i.baseY + Math.sin(time * i.bobSpeed + i.bobPhase) * 1;
        island.rotation.y += i.rotateSpeed * deltaTime;
    });

    // Aurora waving
    auroraLights.forEach(aurora => {
        const a = aurora.userData;
        const positions = aurora.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = aurora.geometry.attributes.position.getX(i / 3);
            positions[i + 2] = Math.sin(time * a.waveSpeed + x * 0.2 + a.wavePhase) * 3;
        }
        aurora.geometry.attributes.position.needsUpdate = true;
        aurora.material.opacity = 0.2 + Math.sin(time * 0.5 + a.wavePhase) * 0.1;
    });

    // Stars twinkling
    stars.forEach(star => {
        const s = star.userData;
        star.material.opacity = 0.5 + Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.5;
    });
}
