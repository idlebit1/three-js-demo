// Valentine — float world
// Rose floor + mountains + altitude layers + heart archways + floating hearts + rose petals + cupid arrows + candy hearts + love letters

export default {
    name: 'valentine',
    label: 'Valentine',
    sphereInteractionType: 'float',

    lighting: {
        background: 0x4a1028,
        ambient: { color: 0xff88aa, intensity: 0.4 },
        key: { color: 0xff6688, intensity: 1.2 },
        extras: [],
    },

    skyColor(altitude) {
        const color = { h: 0, s: 0, l: 0 };
        if (altitude < 40) {
            color.h = 0.95; color.s = 0.5; color.l = 0.18 + altitude * 0.003;
        } else if (altitude < 100) {
            color.h = 0.92 + (altitude - 40) * 0.002; color.s = 0.4; color.l = 0.30 - (altitude - 40) * 0.002;
        } else {
            color.h = 0.8; color.s = 0.3; color.l = Math.max(0.05, 0.18 - (altitude - 100) * 0.001);
        }
        return color;
    },

    create(THREE, group) {
        // Distant mountains
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
            group.add(createMountain(Math.cos(angle) * dist, Math.sin(angle) * dist, 15 + Math.random() * 20, 8 + Math.random() * 6));
        }

        // Low clouds (height 20-40)
        const lowClouds = [];
        function createCloud(y, scale) {
            const cloud = new THREE.Group();
            const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.9 });
            for (let i = 0; i < 5 + Math.random() * 5; i++) {
                const puff = new THREE.Mesh(new THREE.SphereGeometry(1 + Math.random(), 8, 6), cloudMat);
                puff.position.set((Math.random() - 0.5) * 3 * scale, (Math.random() - 0.5) * 0.8 * scale, (Math.random() - 0.5) * 2 * scale);
                puff.scale.setScalar(scale);
                cloud.add(puff);
            }
            cloud.position.y = y;
            cloud.userData = { baseX: (Math.random() - 0.5) * 80, baseZ: (Math.random() - 0.5) * 80, driftSpeed: 0.5 + Math.random() * 0.5, driftPhase: Math.random() * Math.PI * 2 };
            cloud.position.x = cloud.userData.baseX;
            cloud.position.z = cloud.userData.baseZ;
            return cloud;
        }
        for (let i = 0; i < 20; i++) {
            const cloud = createCloud(20 + Math.random() * 20, 1 + Math.random());
            lowClouds.push(cloud);
            group.add(cloud);
        }

        // Flying birds (height 30-60)
        const grandBirds = [];
        function createBird() {
            const bird = new THREE.Group();
            const body = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1, 6), new THREE.MeshStandardMaterial({ color: 0x333333 }));
            body.rotation.z = Math.PI / 2;
            bird.add(body);
            const leftWing = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.4), new THREE.MeshStandardMaterial({ color: 0x444444, side: THREE.DoubleSide }));
            leftWing.position.set(0, 0.1, 0);
            bird.add(leftWing);
            bird.userData = { leftWing, baseY: 30 + Math.random() * 30, circleRadius: 10 + Math.random() * 20, circleSpeed: 0.2 + Math.random() * 0.2, phase: Math.random() * Math.PI * 2 };
            return bird;
        }
        for (let i = 0; i < 15; i++) {
            const bird = createBird();
            grandBirds.push(bird);
            group.add(bird);
        }

        // Floating islands (height 50-100)
        const floatingIslands = [];
        function createIsland(y) {
            const island = new THREE.Group();
            const rockGeo = new THREE.IcosahedronGeometry(3 + Math.random() * 2, 1);
            const pos = rockGeo.attributes.position.array;
            for (let i = 0; i < pos.length; i += 3) {
                if (pos[i + 1] < 0) pos[i + 1] *= 1.5;
                pos[i] += (Math.random() - 0.5) * 0.5;
                pos[i + 2] += (Math.random() - 0.5) * 0.5;
            }
            rockGeo.computeVertexNormals();
            island.add(new THREE.Mesh(rockGeo, new THREE.MeshStandardMaterial({ color: 0x6b5344, roughness: 0.9 })));
            const grassTop = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3, 0.5, 12), new THREE.MeshStandardMaterial({ color: 0x4a9f4d }));
            grassTop.position.y = 1.5;
            island.add(grassTop);
            for (let i = 0; i < 2 + Math.random() * 3; i++) {
                const miniTree = new THREE.Group();
                const t = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 1, 6), new THREE.MeshStandardMaterial({ color: 0x5c4033 }));
                t.position.y = 0.5;
                miniTree.add(t);
                const l = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.2, 6), new THREE.MeshStandardMaterial({ color: 0x2d5a27 }));
                l.position.y = 1.3;
                miniTree.add(l);
                miniTree.position.set((Math.random() - 0.5) * 3, 1.7, (Math.random() - 0.5) * 3);
                island.add(miniTree);
            }
            if (Math.random() > 0.5) {
                const waterfall = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 8, 8), new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6 }));
                waterfall.position.set(2, -3, 0);
                island.add(waterfall);
            }
            island.position.set((Math.random() - 0.5) * 60, y, (Math.random() - 0.5) * 60);
            island.userData = { baseY: y, bobSpeed: 0.2 + Math.random() * 0.1, bobPhase: Math.random() * Math.PI * 2, rotateSpeed: 0.05 + Math.random() * 0.05 };
            return island;
        }
        for (let i = 0; i < 8; i++) {
            const island = createIsland(50 + Math.random() * 50);
            floatingIslands.push(island);
            group.add(island);
        }

        // High clouds (height 80-120)
        const highClouds = [];
        for (let i = 0; i < 15; i++) {
            const cloud = createCloud(80 + Math.random() * 40, 2 + Math.random() * 2);
            cloud.children.forEach(puff => { puff.material = puff.material.clone(); puff.material.opacity = 0.5; });
            highClouds.push(cloud);
            group.add(cloud);
        }

        // Aurora (height 120-180)
        const auroraLights = [];
        const auroraMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
        for (let i = 0; i < 6; i++) {
            const aurora = new THREE.Mesh(new THREE.PlaneGeometry(30, 20, 10, 10), auroraMat.clone());
            aurora.material.color.setHSL(0.3 + Math.random() * 0.4, 0.8, 0.5);
            aurora.position.set((Math.random() - 0.5) * 80, 130 + Math.random() * 40, (Math.random() - 0.5) * 80);
            aurora.rotation.y = Math.random() * Math.PI;
            aurora.userData = { waveSpeed: 0.5 + Math.random() * 0.5, wavePhase: Math.random() * Math.PI * 2 };
            auroraLights.push(aurora);
            group.add(aurora);
        }

        // Stars (height 150+)
        const stars = [];
        const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        for (let i = 0; i < 200; i++) {
            const star = new THREE.Mesh(new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 4, 4), starMat.clone());
            const a = Math.random() * Math.PI * 2;
            const d = 50 + Math.random() * 100;
            star.position.set(Math.cos(a) * d, 160 + Math.random() * 100, Math.sin(a) * d);
            star.userData = { twinkleSpeed: 2 + Math.random() * 3, twinklePhase: Math.random() * Math.PI * 2 };
            stars.push(star);
            group.add(star);
        }

        // Rose-pink floor
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(180, 180),
            new THREE.MeshStandardMaterial({ color: 0x8b3a5c, roughness: 0.9 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.5;
        group.add(floor);

        // Heart archways around the perimeter
        for (let i = 0; i < 6; i++) {
            const arch = new THREE.Group();
            for (const side of [-1, 1]) {
                const pillar = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.8, 1, 18, 8),
                    new THREE.MeshStandardMaterial({ color: 0xcc4466 })
                );
                pillar.position.set(side * 4, 9, 0);
                arch.add(pillar);
            }
            const archTop = new THREE.Mesh(
                new THREE.TorusGeometry(4, 0.6, 8, 16, Math.PI),
                new THREE.MeshStandardMaterial({ color: 0xff5577 })
            );
            archTop.position.y = 18;
            archTop.rotation.z = Math.PI;
            arch.add(archTop);
            const angle = (i / 6) * Math.PI * 2;
            arch.position.set(Math.cos(angle) * 45, 0, Math.sin(angle) * 45);
            arch.rotation.y = angle;
            group.add(arch);
        }

        // Floating hearts at various heights
        const hearts = [];
        for (let i = 0; i < 35; i++) {
            const heartShape = new THREE.Shape();
            const s = 0.8 + Math.random() * 1.2;
            heartShape.moveTo(0, s * 0.5);
            heartShape.bezierCurveTo(s * 0.5, s * 1.2, s * 1.2, s * 0.4, 0, -s * 0.5);
            heartShape.moveTo(0, s * 0.5);
            heartShape.bezierCurveTo(-s * 0.5, s * 1.2, -s * 1.2, s * 0.4, 0, -s * 0.5);
            const heartGeo = new THREE.ExtrudeGeometry(heartShape, { depth: s * 0.4, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 2 });
            const hue = 0.93 + Math.random() * 0.07;
            const heart = new THREE.Mesh(heartGeo, new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(hue, 0.7, 0.5 + Math.random() * 0.2),
            }));
            heart.position.set(
                (Math.random() - 0.5) * 70,
                10 + Math.random() * 110,
                (Math.random() - 0.5) * 70
            );
            heart.rotation.set(Math.random() * 0.3, Math.random() * Math.PI, Math.PI);
            heart.userData = { bobPhase: Math.random() * Math.PI * 2, bobSpeed: 0.3 + Math.random() * 0.3, rotSpeed: 0.1 + Math.random() * 0.15 };
            hearts.push(heart);
            group.add(heart);
        }

        // Rose petals drifting
        const petals = [];
        for (let i = 0; i < 60; i++) {
            const petal = new THREE.Mesh(
                new THREE.CircleGeometry(0.3 + Math.random() * 0.3, 6),
                new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(0.95 + Math.random() * 0.05, 0.6, 0.5 + Math.random() * 0.2),
                    side: THREE.DoubleSide, transparent: true, opacity: 0.8
                })
            );
            petal.position.set(
                (Math.random() - 0.5) * 60,
                5 + Math.random() * 120,
                (Math.random() - 0.5) * 60
            );
            petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            petal.userData = { driftPhase: Math.random() * Math.PI * 2, driftSpeed: 0.2 + Math.random() * 0.2 };
            petals.push(petal);
            group.add(petal);
        }

        // Cupid arrows
        const arrows = [];
        for (let i = 0; i < 12; i++) {
            const arrow = new THREE.Group();
            const shaft = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.05, 4, 6),
                new THREE.MeshStandardMaterial({ color: 0xdaa520 })
            );
            shaft.rotation.z = Math.PI / 2;
            arrow.add(shaft);
            const tip = new THREE.Mesh(
                new THREE.ConeGeometry(0.2, 0.6, 6),
                new THREE.MeshStandardMaterial({ color: 0xff3355 })
            );
            tip.rotation.z = -Math.PI / 2;
            tip.position.x = 2.3;
            arrow.add(tip);
            arrow.position.set(
                (Math.random() - 0.5) * 50,
                30 + Math.random() * 80,
                (Math.random() - 0.5) * 50
            );
            arrow.userData = { orbitAngle: Math.random() * Math.PI * 2, orbitRadius: 5 + Math.random() * 15, orbitSpeed: 0.15 + Math.random() * 0.1 };
            arrows.push(arrow);
            group.add(arrow);
        }

        // Candy hearts
        for (let i = 0; i < 20; i++) {
            const candy = new THREE.Mesh(
                new THREE.SphereGeometry(0.5 + Math.random() * 0.3, 8, 6),
                new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(Math.random() > 0.5 ? 0.95 : 0.85, 0.5, 0.7),
                    roughness: 0.6
                })
            );
            candy.scale.y = 0.6;
            candy.position.set(
                (Math.random() - 0.5) * 50,
                15 + Math.random() * 70,
                (Math.random() - 0.5) * 50
            );
            group.add(candy);
        }

        // Floating love letters / envelopes
        for (let i = 0; i < 15; i++) {
            const envelope = new THREE.Mesh(
                new THREE.BoxGeometry(1.5, 0.1, 1),
                new THREE.MeshStandardMaterial({ color: 0xffeedd })
            );
            envelope.position.set(
                (Math.random() - 0.5) * 55,
                20 + Math.random() * 90,
                (Math.random() - 0.5) * 55
            );
            envelope.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
            group.add(envelope);
        }

        // Warm pink glowing orbs
        for (let i = 0; i < 25; i++) {
            const orb = new THREE.Mesh(
                new THREE.SphereGeometry(0.4 + Math.random() * 0.4),
                new THREE.MeshBasicMaterial({ color: 0xff6699, transparent: true, opacity: 0.5 })
            );
            orb.position.set(
                (Math.random() - 0.5) * 70,
                8 + Math.random() * 110,
                (Math.random() - 0.5) * 70
            );
            group.add(orb);
        }

        return { lowClouds, highClouds, grandBirds, floatingIslands, auroraLights, stars, hearts, petals, arrows };
    },

    animate(state, time, deltaTime, group) {
        // Clouds drifting
        [...state.lowClouds, ...state.highClouds].forEach(cloud => {
            const c = cloud.userData;
            cloud.position.x = c.baseX + Math.sin(time * c.driftSpeed * 0.1 + c.driftPhase) * 10;
            cloud.position.z = c.baseZ + Math.cos(time * c.driftSpeed * 0.1 + c.driftPhase) * 5;
        });
        // Birds circling
        state.grandBirds.forEach(bird => {
            const b = bird.userData;
            const angle = time * b.circleSpeed + b.phase;
            bird.position.x = Math.cos(angle) * b.circleRadius;
            bird.position.z = Math.sin(angle) * b.circleRadius;
            bird.position.y = b.baseY + Math.sin(time + b.phase) * 2;
            bird.rotation.y = -angle + Math.PI / 2;
            b.leftWing.rotation.x = Math.sin(time * 4) * 0.4;
        });
        // Islands bobbing
        state.floatingIslands.forEach(island => {
            const u = island.userData;
            island.position.y = u.baseY + Math.sin(time * u.bobSpeed + u.bobPhase) * 1;
            island.rotation.y += u.rotateSpeed * deltaTime;
        });
        // Aurora waving
        state.auroraLights.forEach(aurora => {
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
        state.stars.forEach(star => {
            const s = star.userData;
            star.material.opacity = 0.5 + Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.5;
        });

        // Hearts bobbing and slowly rotating
        state.hearts.forEach(heart => {
            const u = heart.userData;
            heart.position.y += Math.sin(time * u.bobSpeed + u.bobPhase) * 0.01;
            heart.rotation.y += u.rotSpeed * deltaTime;
        });

        // Rose petals drifting and tumbling
        state.petals.forEach(petal => {
            const u = petal.userData;
            petal.rotation.x += u.driftSpeed * deltaTime;
            petal.rotation.z += u.driftSpeed * deltaTime * 0.7;
            petal.position.x += Math.sin(time * 0.3 + u.driftPhase) * 0.02;
            petal.position.y += Math.cos(time * 0.2 + u.driftPhase) * 0.01;
        });

        // Cupid arrows orbiting
        state.arrows.forEach(arrow => {
            const u = arrow.userData;
            u.orbitAngle += u.orbitSpeed * deltaTime;
            arrow.position.x += Math.cos(u.orbitAngle) * 0.08;
            arrow.position.z += Math.sin(u.orbitAngle) * 0.08;
            arrow.rotation.y = -u.orbitAngle;
        });
    },

    interact(state, mesh, point, geoType, ctx) {
        if (geoType === 'ExtrudeGeometry') {
            ctx.squishObject(mesh, point);
        } else if (geoType === 'BoxGeometry' || geoType === 'CylinderGeometry') {
            ctx.kickObject(mesh, point);
        }
    },
};
