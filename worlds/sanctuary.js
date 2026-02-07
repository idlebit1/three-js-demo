// Sanctuary — float world
// Carpet floor + mountains + altitude layers + rugs + cabin walls + pillows + family silhouettes + warm orbs

export default {
    name: 'sanctuary',
    label: 'Sanctuary',
    sphereInteractionType: 'float',

    lighting: {
        background: 0x2a1810,
        ambient: { color: 0xffddbb, intensity: 0.3 },
        key: { color: 0xffaa66, intensity: 1.2 },
        extras: [],
    },

    skyColor(altitude) {
        const color = { h: 0, s: 0, l: 0 };
        if (altitude < 40) {
            color.h = 0.06; color.s = 0.45; color.l = 0.12 + altitude * 0.003;
        } else if (altitude < 100) {
            color.h = 0.08 + (altitude - 40) * 0.005; color.s = 0.35; color.l = 0.24;
        } else {
            color.h = 0.72; color.s = 0.25; color.l = Math.max(0.08, 0.2 - (altitude - 100) * 0.001);
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

        // Warm soft carpet floor
        const hearthGrandFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(180, 180),
            new THREE.MeshStandardMaterial({ color: 0x8b6b5c, roughness: 1.0 })
        );
        hearthGrandFloor.rotation.x = -Math.PI / 2;
        hearthGrandFloor.position.y = -0.5;
        group.add(hearthGrandFloor);

        // Cozy circular rug patterns
        for (let i = 0; i < 5; i++) {
            const rug = new THREE.Mesh(
                new THREE.CircleGeometry(6 + Math.random() * 4, 24),
                new THREE.MeshStandardMaterial({ color: 0xcc9977, roughness: 1.0 })
            );
            rug.rotation.x = -Math.PI / 2;
            rug.position.set((Math.random() - 0.5) * 60, -0.4, (Math.random() - 0.5) * 60);
            group.add(rug);
        }

        // Distant cozy cabin walls with warm windows
        for (let i = 0; i < 6; i++) {
            const cabinWall = new THREE.Mesh(
                new THREE.BoxGeometry(25, 15, 1),
                new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 })
            );
            const angle = (i / 6) * Math.PI * 2;
            cabinWall.position.set(Math.cos(angle) * 55, 7, Math.sin(angle) * 55);
            cabinWall.rotation.y = angle;
            group.add(cabinWall);

            const win = new THREE.Mesh(
                new THREE.PlaneGeometry(4, 4),
                new THREE.MeshBasicMaterial({ color: 0xffcc77 })
            );
            win.position.set(Math.cos(angle) * 54, 7, Math.sin(angle) * 54);
            win.rotation.y = angle;
            group.add(win);
        }

        // Dreamy floating pillows
        for (let i = 0; i < 20; i++) {
            const pillow = new THREE.Mesh(
                new THREE.BoxGeometry(2, 0.5, 1.5),
                new THREE.MeshStandardMaterial({ color: 0xeeddcc, roughness: 1 })
            );
            pillow.position.set(
                (Math.random() - 0.5) * 40,
                15 + Math.random() * 60,
                (Math.random() - 0.5) * 40
            );
            pillow.rotation.set(Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3);
            group.add(pillow);
        }

        // Floating family silhouettes
        for (let i = 0; i < 5; i++) {
            const familyCluster = new THREE.Group();
            for (let j = 0; j < 3 + Math.floor(Math.random() * 2); j++) {
                const figure = new THREE.Mesh(
                    new THREE.SphereGeometry(0.3 + Math.random() * 0.3),
                    new THREE.MeshStandardMaterial({ color: 0xffddcc, transparent: true, opacity: 0.7 })
                );
                figure.position.set((Math.random() - 0.5) * 1.5, Math.random() * 0.5, (Math.random() - 0.5) * 1.5);
                familyCluster.add(figure);
            }
            familyCluster.position.set(
                (Math.random() - 0.5) * 50,
                60 + Math.random() * 60,
                (Math.random() - 0.5) * 50
            );
            group.add(familyCluster);
        }

        // Warm glowing orbs
        for (let i = 0; i < 30; i++) {
            const warmOrb = new THREE.Mesh(
                new THREE.SphereGeometry(0.5 + Math.random() * 0.5),
                new THREE.MeshBasicMaterial({ color: 0xffaa55, transparent: true, opacity: 0.6 })
            );
            warmOrb.position.set(
                (Math.random() - 0.5) * 70,
                10 + Math.random() * 100,
                (Math.random() - 0.5) * 70
            );
            group.add(warmOrb);
        }

        return { lowClouds, highClouds, grandBirds, floatingIslands, auroraLights, stars };
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
    },

    interact(state, mesh, point, geoType, ctx) {
        if (geoType === 'BoxGeometry') {
            ctx.kickObject(mesh, point);
        } else if (geoType === 'SphereGeometry') {
            ctx.squishObject(mesh, point);
        }
    },
};
