// Rabbit — float world
// Soft meadow + flowers + carrots + lots of rabbits + moon + stars + companion rabbit

export default {
    name: 'rabbit',
    label: 'Rabbit Meadow',
    sphereInteractionType: 'float',

    lighting: {
        background: 0x7eb8c9,
        ambient: { color: 0xccddff, intensity: 0.6 },
        key: { color: 0xffeedd, intensity: 1.0 },
        extras: [],
    },

    skyColor(altitude) {
        const color = { h: 0, s: 0, l: 0 };
        if (altitude < 40) {
            color.h = 0.55; color.s = 0.35; color.l = 0.55 - altitude * 0.003;
        } else if (altitude < 100) {
            color.h = 0.6; color.s = 0.3; color.l = 0.43 - (altitude - 40) * 0.003;
        } else {
            color.h = 0.65; color.s = 0.2; color.l = Math.max(0.05, 0.25 - (altitude - 100) * 0.002);
        }
        return color;
    },

    create(THREE, group) {
        // ── Mountains ──
        function createMountain(x, z, height, width) {
            const geo = new THREE.ConeGeometry(width, height, 6);
            const mat = new THREE.MeshStandardMaterial({ color: 0x7a9a6d, roughness: 0.9 });
            const m = new THREE.Mesh(geo, mat);
            m.position.set(x, height / 2 - 0.5, z);
            const snowGeo = new THREE.ConeGeometry(width * 0.4, height * 0.3, 6);
            const snow = new THREE.Mesh(snowGeo, new THREE.MeshStandardMaterial({ color: 0xeeffee }));
            snow.position.y = height * 0.35;
            m.add(snow);
            return m;
        }
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const dist = 65 + Math.random() * 20;
            group.add(createMountain(Math.cos(angle) * dist, Math.sin(angle) * dist, 12 + Math.random() * 15, 8 + Math.random() * 5));
        }

        // ── Soft meadow floor ──
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(180, 180),
            new THREE.MeshStandardMaterial({ color: 0x88bb66, roughness: 1.0 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.5;
        group.add(floor);

        // Grass tufts
        for (let i = 0; i < 60; i++) {
            const tuft = new THREE.Mesh(
                new THREE.ConeGeometry(0.3 + Math.random() * 0.3, 0.6 + Math.random() * 0.4, 4),
                new THREE.MeshStandardMaterial({ color: 0x6da853 })
            );
            tuft.position.set((Math.random() - 0.5) * 80, 0, (Math.random() - 0.5) * 80);
            group.add(tuft);
        }

        // ── Flowers ──
        function createFlower(x, z) {
            const flower = new THREE.Group();
            // Stem
            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.05, 1, 6),
                new THREE.MeshStandardMaterial({ color: 0x44882a })
            );
            stem.position.y = 0.5;
            flower.add(stem);
            // Petals
            const petalColors = [0xffaacc, 0xffccdd, 0xeebb99, 0xddaaff, 0xffffaa, 0xaaddff];
            const petalColor = petalColors[Math.floor(Math.random() * petalColors.length)];
            for (let p = 0; p < 5; p++) {
                const petal = new THREE.Mesh(
                    new THREE.SphereGeometry(0.2, 6, 4),
                    new THREE.MeshStandardMaterial({ color: petalColor })
                );
                const a = (p / 5) * Math.PI * 2;
                petal.position.set(Math.cos(a) * 0.25, 1.05, Math.sin(a) * 0.25);
                petal.scale.set(1, 0.5, 1);
                flower.add(petal);
            }
            // Center
            const center = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 6, 4),
                new THREE.MeshStandardMaterial({ color: 0xffdd44 })
            );
            center.position.y = 1.05;
            flower.add(center);
            flower.position.set(x, -0.5, z);
            flower.scale.setScalar(0.8 + Math.random() * 0.6);
            return flower;
        }
        for (let i = 0; i < 80; i++) {
            group.add(createFlower((Math.random() - 0.5) * 70, (Math.random() - 0.5) * 70));
        }

        // ── Carrots ──
        for (let i = 0; i < 40; i++) {
            const carrot = new THREE.Group();
            const root = new THREE.Mesh(
                new THREE.ConeGeometry(0.15, 0.8, 6),
                new THREE.MeshStandardMaterial({ color: 0xff8833 })
            );
            root.position.y = -0.1;
            root.rotation.x = Math.PI;
            carrot.add(root);
            // Green top
            for (let t = 0; t < 3; t++) {
                const leaf = new THREE.Mesh(
                    new THREE.ConeGeometry(0.06, 0.5, 4),
                    new THREE.MeshStandardMaterial({ color: 0x44aa22 })
                );
                leaf.position.set((Math.random() - 0.5) * 0.1, 0.25, (Math.random() - 0.5) * 0.1);
                leaf.rotation.z = (Math.random() - 0.5) * 0.4;
                carrot.add(leaf);
            }
            carrot.position.set((Math.random() - 0.5) * 60, -0.2, (Math.random() - 0.5) * 60);
            group.add(carrot);
        }

        // ── Rabbit burrow holes ──
        for (let i = 0; i < 12; i++) {
            const hole = new THREE.Mesh(
                new THREE.CircleGeometry(0.5 + Math.random() * 0.3, 12),
                new THREE.MeshStandardMaterial({ color: 0x443322 })
            );
            hole.rotation.x = -Math.PI / 2;
            hole.position.set((Math.random() - 0.5) * 50, -0.45, (Math.random() - 0.5) * 50);
            group.add(hole);
        }

        // ── Rabbits ──
        const rabbits = [];
        function createRabbit(x, z, size) {
            const rabbit = new THREE.Group();
            const bodyMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.8 });
            // Body
            const body = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 6), bodyMat);
            body.scale.set(1, 0.85, 1.2);
            rabbit.add(body);
            // Head
            const head = new THREE.Mesh(new THREE.SphereGeometry(size * 0.65, 8, 6), bodyMat);
            head.position.set(0, size * 0.7, size * 0.8);
            rabbit.add(head);
            // Eyes
            const eyeMat = new THREE.MeshStandardMaterial({ color: 0x332222 });
            const leftEye = new THREE.Mesh(new THREE.SphereGeometry(size * 0.08, 4, 4), eyeMat);
            leftEye.position.set(size * 0.2, size * 0.85, size * 1.2);
            rabbit.add(leftEye);
            const rightEye = new THREE.Mesh(new THREE.SphereGeometry(size * 0.08, 4, 4), eyeMat);
            rightEye.position.set(-size * 0.2, size * 0.85, size * 1.2);
            rabbit.add(rightEye);
            // Nose
            const nose = new THREE.Mesh(
                new THREE.SphereGeometry(size * 0.06, 4, 4),
                new THREE.MeshStandardMaterial({ color: 0xffaaaa })
            );
            nose.position.set(0, size * 0.7, size * 1.4);
            rabbit.add(nose);
            // Ears
            const earMat = new THREE.MeshStandardMaterial({ color: 0xddcccc });
            const leftEar = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.12, size * 0.08, size * 1.0, 6), earMat);
            leftEar.position.set(size * 0.2, size * 1.4, size * 0.6);
            leftEar.rotation.x = -0.2;
            rabbit.add(leftEar);
            const rightEar = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.12, size * 0.08, size * 1.0, 6), earMat);
            rightEar.position.set(-size * 0.2, size * 1.4, size * 0.6);
            rightEar.rotation.x = -0.2;
            rabbit.add(rightEar);
            // Tail
            const tail = new THREE.Mesh(
                new THREE.SphereGeometry(size * 0.25, 6, 4),
                bodyMat
            );
            tail.position.set(0, size * 0.1, -size * 1.0);
            rabbit.add(tail);

            rabbit.position.set(x, -0.1, z);
            rabbit.userData = {
                leftEar, rightEar,
                hopPhase: Math.random() * Math.PI * 2,
                hopSpeed: 1.5 + Math.random() * 1.5,
                wanderAngle: Math.random() * Math.PI * 2,
                wanderSpeed: 0.3 + Math.random() * 0.4,
                baseX: x,
                baseZ: z,
                wanderRadius: 3 + Math.random() * 8,
            };
            return rabbit;
        }

        // Ground rabbits — different sizes and colors
        const rabbitColors = [0xeeeeee, 0xddccbb, 0xbbaa99, 0xeeddcc, 0xccbbaa, 0xffeedd];
        for (let i = 0; i < 30; i++) {
            const x = (Math.random() - 0.5) * 60;
            const z = (Math.random() - 0.5) * 60;
            const size = 0.4 + Math.random() * 0.4;
            const rabbit = createRabbit(x, z, size);
            // Tint some rabbits
            const tint = rabbitColors[Math.floor(Math.random() * rabbitColors.length)];
            rabbit.children.forEach(child => {
                if (child.material && child.material.color && child.material.color.getHex() === 0xeeeeee) {
                    child.material = child.material.clone();
                    child.material.color.setHex(tint);
                }
            });
            rabbits.push(rabbit);
            group.add(rabbit);
        }

        // ── Companion rabbit (follows player up) ──
        const companion = createRabbit(2, 2, 0.5);
        companion.children.forEach(child => {
            if (child.material && child.material.color && child.material.color.getHex() === 0xeeeeee) {
                child.material = child.material.clone();
                child.material.color.setHex(0xffd4e8);
            }
        });
        companion.userData.isCompanion = true;
        companion.userData.targetY = -0.1;
        group.add(companion);

        // ── Floating flower petals (altitude 5-40) ──
        const petals = [];
        const petalColors = [0xffaacc, 0xffccdd, 0xeebb99, 0xddaaff, 0xffffaa];
        for (let i = 0; i < 50; i++) {
            const petal = new THREE.Mesh(
                new THREE.PlaneGeometry(0.3 + Math.random() * 0.3, 0.2 + Math.random() * 0.2),
                new THREE.MeshStandardMaterial({
                    color: petalColors[Math.floor(Math.random() * petalColors.length)],
                    side: THREE.DoubleSide, transparent: true, opacity: 0.8
                })
            );
            petal.position.set(
                (Math.random() - 0.5) * 60,
                3 + Math.random() * 35,
                (Math.random() - 0.5) * 60
            );
            petal.rotation.set(Math.random(), Math.random() * Math.PI, Math.random());
            petal.userData = { driftSpeed: 0.3 + Math.random() * 0.3, phase: Math.random() * Math.PI * 2 };
            petals.push(petal);
            group.add(petal);
        }

        // ── Low clouds (height 20-40) ──
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
        for (let i = 0; i < 15; i++) {
            const cloud = createCloud(20 + Math.random() * 20, 1 + Math.random());
            lowClouds.push(cloud);
            group.add(cloud);
        }

        // ── Butterflies (height 5-30) ──
        const butterflies = [];
        const butterflyColors = [0xffaadd, 0xaaddff, 0xffffaa, 0xddffaa, 0xffddaa];
        for (let i = 0; i < 20; i++) {
            const butterfly = new THREE.Group();
            const wingColor = butterflyColors[Math.floor(Math.random() * butterflyColors.length)];
            const wingMat = new THREE.MeshStandardMaterial({ color: wingColor, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
            const leftWing = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), wingMat);
            leftWing.position.x = 0.2;
            butterfly.add(leftWing);
            const rightWing = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), wingMat);
            rightWing.position.x = -0.2;
            butterfly.add(rightWing);
            const bodyMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4),
                new THREE.MeshStandardMaterial({ color: 0x333333 })
            );
            bodyMesh.rotation.z = Math.PI / 2;
            butterfly.add(bodyMesh);
            butterfly.position.set(
                (Math.random() - 0.5) * 50,
                3 + Math.random() * 25,
                (Math.random() - 0.5) * 50
            );
            butterfly.userData = {
                leftWing, rightWing,
                circleRadius: 3 + Math.random() * 8,
                circleSpeed: 0.3 + Math.random() * 0.3,
                phase: Math.random() * Math.PI * 2,
                baseY: butterfly.position.y,
            };
            butterflies.push(butterfly);
            group.add(butterfly);
        }

        // ── Floating islands (height 50-90) ──
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
            island.add(new THREE.Mesh(rockGeo, new THREE.MeshStandardMaterial({ color: 0x7a6b5a, roughness: 0.9 })));
            const grassTop = new THREE.Mesh(
                new THREE.CylinderGeometry(2.5, 3, 0.5, 12),
                new THREE.MeshStandardMaterial({ color: 0x88bb66 })
            );
            grassTop.position.y = 1.5;
            island.add(grassTop);
            // Add a few flowers on island
            for (let i = 0; i < 3; i++) {
                const flowerStem = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.03, 0.03, 0.5, 4),
                    new THREE.MeshStandardMaterial({ color: 0x44882a })
                );
                flowerStem.position.set((Math.random() - 0.5) * 2, 2, (Math.random() - 0.5) * 2);
                island.add(flowerStem);
                const flowerHead = new THREE.Mesh(
                    new THREE.SphereGeometry(0.15, 6, 4),
                    new THREE.MeshStandardMaterial({ color: petalColors[Math.floor(Math.random() * petalColors.length)] })
                );
                flowerHead.position.copy(flowerStem.position);
                flowerHead.position.y += 0.3;
                island.add(flowerHead);
            }
            // Small rabbit on some islands
            if (Math.random() > 0.5) {
                const islandRabbit = createRabbit(0, 0, 0.3);
                islandRabbit.position.y = 1.8;
                islandRabbit.position.x = (Math.random() - 0.5) * 2;
                islandRabbit.position.z = (Math.random() - 0.5) * 2;
                island.add(islandRabbit);
            }
            island.position.set((Math.random() - 0.5) * 60, y, (Math.random() - 0.5) * 60);
            island.userData = { baseY: y, bobSpeed: 0.2 + Math.random() * 0.1, bobPhase: Math.random() * Math.PI * 2, rotateSpeed: 0.03 + Math.random() * 0.03 };
            return island;
        }
        for (let i = 0; i < 6; i++) {
            const island = createIsland(50 + Math.random() * 40);
            floatingIslands.push(island);
            group.add(island);
        }

        // ── High clouds (height 70-110) ──
        const highClouds = [];
        for (let i = 0; i < 12; i++) {
            const cloud = createCloud(70 + Math.random() * 40, 2 + Math.random() * 2);
            cloud.children.forEach(puff => { puff.material = puff.material.clone(); puff.material.opacity = 0.4; });
            highClouds.push(cloud);
            group.add(cloud);
        }

        // ── Moon (height 140) ──
        const moon = new THREE.Group();
        const moonSphere = new THREE.Mesh(
            new THREE.SphereGeometry(12, 24, 24),
            new THREE.MeshBasicMaterial({ color: 0xffffee })
        );
        moon.add(moonSphere);
        // Craters
        const craterMat = new THREE.MeshBasicMaterial({ color: 0xeeeedd });
        for (let i = 0; i < 8; i++) {
            const crater = new THREE.Mesh(new THREE.SphereGeometry(1 + Math.random() * 2, 8, 8), craterMat);
            const a = Math.random() * Math.PI * 2;
            const p = Math.random() * Math.PI;
            crater.position.set(
                Math.sin(p) * Math.cos(a) * 11,
                Math.sin(p) * Math.sin(a) * 11,
                Math.cos(p) * 11
            );
            moon.add(crater);
        }
        // Moon glow
        const moonGlow = new THREE.Mesh(
            new THREE.SphereGeometry(15, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 })
        );
        moon.add(moonGlow);
        moon.position.set(30, 150, -40);
        group.add(moon);

        // ── Stars (height 120+) ──
        const stars = [];
        const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        for (let i = 0; i < 250; i++) {
            const star = new THREE.Mesh(new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 4, 4), starMat.clone());
            const a = Math.random() * Math.PI * 2;
            const d = 50 + Math.random() * 100;
            star.position.set(Math.cos(a) * d, 130 + Math.random() * 120, Math.sin(a) * d);
            star.userData = { twinkleSpeed: 2 + Math.random() * 3, twinklePhase: Math.random() * Math.PI * 2 };
            stars.push(star);
            group.add(star);
        }

        // ── Fireflies (gentle glow dots at dusk heights 10-60) ──
        const fireflies = [];
        for (let i = 0; i < 40; i++) {
            const ff = new THREE.Mesh(
                new THREE.SphereGeometry(0.08 + Math.random() * 0.08),
                new THREE.MeshBasicMaterial({ color: 0xeeff88, transparent: true, opacity: 0.7 })
            );
            ff.position.set(
                (Math.random() - 0.5) * 60,
                5 + Math.random() * 55,
                (Math.random() - 0.5) * 60
            );
            ff.userData = { phase: Math.random() * Math.PI * 2, speed: 1 + Math.random() * 2 };
            fireflies.push(ff);
            group.add(ff);
        }

        return { rabbits, companion, lowClouds, highClouds, floatingIslands, stars, petals, butterflies, fireflies, moon };
    },

    animate(state, time, deltaTime, group) {
        // Ground rabbits hopping and wandering
        state.rabbits.forEach(rabbit => {
            const u = rabbit.userData;
            // Wander in circle
            u.wanderAngle += u.wanderSpeed * deltaTime * 0.3;
            const tx = u.baseX + Math.cos(u.wanderAngle) * u.wanderRadius;
            const tz = u.baseZ + Math.sin(u.wanderAngle) * u.wanderRadius;
            rabbit.position.x += (tx - rabbit.position.x) * 0.02;
            rabbit.position.z += (tz - rabbit.position.z) * 0.02;
            // Face movement direction
            rabbit.rotation.y = Math.atan2(tx - rabbit.position.x, tz - rabbit.position.z);
            // Hop
            const hop = Math.abs(Math.sin(time * u.hopSpeed + u.hopPhase));
            rabbit.position.y = -0.1 + hop * 0.3;
            // Ear wiggle
            if (u.leftEar) u.leftEar.rotation.z = Math.sin(time * 3 + u.hopPhase) * 0.15;
            if (u.rightEar) u.rightEar.rotation.z = -Math.sin(time * 3 + u.hopPhase) * 0.15;
        });

        // Companion rabbit follows character
        const comp = state.companion;
        const charY = group.userData.charY || 0;
        const targetY = charY - 0.5;
        comp.position.y += (targetY - comp.position.y) * 0.04;
        comp.position.x = 2 + Math.sin(time * 0.5) * 1.5;
        comp.position.z = 2 + Math.cos(time * 0.5) * 1.5;
        // Face movement direction
        comp.rotation.y = -time * 0.5 + Math.PI;
        // Hop
        const compHop = Math.abs(Math.sin(time * 2.5));
        comp.position.y += compHop * 0.2;
        const cu = comp.userData;
        if (cu.leftEar) cu.leftEar.rotation.z = Math.sin(time * 4) * 0.2;
        if (cu.rightEar) cu.rightEar.rotation.z = -Math.sin(time * 4) * 0.2;

        // Floating petals
        state.petals.forEach(petal => {
            const u = petal.userData;
            petal.rotation.z += u.driftSpeed * deltaTime;
            petal.position.x += Math.sin(time * 0.3 + u.phase) * 0.01;
            petal.position.y += Math.sin(time * 0.5 + u.phase) * 0.005;
        });

        // Butterflies
        state.butterflies.forEach(bf => {
            const u = bf.userData;
            const angle = time * u.circleSpeed + u.phase;
            bf.position.x = Math.cos(angle) * u.circleRadius;
            bf.position.z = Math.sin(angle) * u.circleRadius;
            bf.position.y = u.baseY + Math.sin(time * 0.8 + u.phase) * 2;
            bf.rotation.y = -angle + Math.PI / 2;
            // Wing flap
            u.leftWing.rotation.y = Math.sin(time * 8 + u.phase) * 0.6;
            u.rightWing.rotation.y = -Math.sin(time * 8 + u.phase) * 0.6;
        });

        // Clouds drifting
        [...state.lowClouds, ...state.highClouds].forEach(cloud => {
            const c = cloud.userData;
            cloud.position.x = c.baseX + Math.sin(time * c.driftSpeed * 0.1 + c.driftPhase) * 10;
            cloud.position.z = c.baseZ + Math.cos(time * c.driftSpeed * 0.1 + c.driftPhase) * 5;
        });

        // Islands bobbing
        state.floatingIslands.forEach(island => {
            const u = island.userData;
            island.position.y = u.baseY + Math.sin(time * u.bobSpeed + u.bobPhase) * 1;
            island.rotation.y += u.rotateSpeed * deltaTime;
        });

        // Stars twinkling
        state.stars.forEach(star => {
            const s = star.userData;
            star.material.opacity = 0.4 + Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.6;
        });

        // Fireflies pulsing
        state.fireflies.forEach(ff => {
            const u = ff.userData;
            ff.material.opacity = 0.3 + Math.sin(time * u.speed + u.phase) * 0.4;
            ff.position.x += Math.sin(time * 0.5 + u.phase) * 0.01;
            ff.position.y += Math.cos(time * 0.3 + u.phase) * 0.005;
        });

        // Moon slow rotation
        state.moon.rotation.y += 0.01 * deltaTime;
    },

    interact(state, mesh, point, geoType, ctx) {
        if (geoType === 'SphereGeometry') {
            ctx.squishObject(mesh, point);
        } else if (geoType === 'ConeGeometry') {
            ctx.kickObject(mesh, point);
        }
    },
};
