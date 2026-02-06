import * as THREE from 'three';

export default {
    name: 'glade',
    label: 'Forest Glade',
    grandNature: true,

    lighting: {
        background: 0x87ceeb,
        ambient: { color: 0xffffff, intensity: 0.5 },
        key: { color: 0xfffaf0, intensity: 1.3 },
        extras: [],
    },

    create(THREE, group) {
        // Grassy ground
        const grassMaterial = new THREE.MeshStandardMaterial({
            color: 0x3d8c40,
            roughness: 0.9,
            metalness: 0.0,
        });
        const gladeGround = new THREE.Mesh(
            new THREE.CircleGeometry(8, 48),
            grassMaterial
        );
        gladeGround.rotation.x = -Math.PI / 2;
        gladeGround.position.y = -0.1;
        gladeGround.receiveShadow = true;
        group.add(gladeGround);

        // Grass blades
        const grassBladeMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a9f4d,
            roughness: 0.8,
            side: THREE.DoubleSide,
        });

        const grassBlades = [];
        for (let i = 0; i < 300; i++) {
            const blade = new THREE.Mesh(
                new THREE.PlaneGeometry(0.03, 0.15 + Math.random() * 0.15),
                grassBladeMaterial.clone()
            );
            blade.material.color.setHSL(0.3 + Math.random() * 0.05, 0.5 + Math.random() * 0.2, 0.35 + Math.random() * 0.1);

            const angle = Math.random() * Math.PI * 2;
            const radius = 1 + Math.random() * 6;
            blade.position.set(
                Math.cos(angle) * radius,
                0.07,
                Math.sin(angle) * radius
            );
            blade.rotation.y = Math.random() * Math.PI;
            blade.rotation.x = -0.1;

            blade.userData = {
                swayPhase: Math.random() * Math.PI * 2,
                swaySpeed: 1 + Math.random() * 0.5,
            };

            grassBlades.push(blade);
            group.add(blade);
        }

        // Trees
        function createTree(x, z, height, canopySize) {
            const treeGroup = new THREE.Group();

            const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, height, 8);
            const trunkMat = new THREE.MeshStandardMaterial({
                color: 0x5c4033,
                roughness: 0.9,
            });
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = height / 2;
            trunk.castShadow = true;
            treeGroup.add(trunk);

            const canopyMat = new THREE.MeshStandardMaterial({
                color: 0x2d5a27,
                roughness: 0.8,
            });

            for (let i = 0; i < 5; i++) {
                const leafCluster = new THREE.Mesh(
                    new THREE.IcosahedronGeometry(canopySize * (0.6 + Math.random() * 0.4), 1),
                    canopyMat.clone()
                );
                leafCluster.material.color.setHSL(0.28 + Math.random() * 0.05, 0.5, 0.25 + Math.random() * 0.1);
                leafCluster.position.set(
                    (Math.random() - 0.5) * canopySize * 0.8,
                    height + (Math.random() - 0.3) * canopySize * 0.5,
                    (Math.random() - 0.5) * canopySize * 0.8
                );
                leafCluster.castShadow = true;
                treeGroup.add(leafCluster);
            }

            treeGroup.position.set(x, 0, z);
            return treeGroup;
        }

        group.add(createTree(-4, -3, 2.5, 1.2));
        group.add(createTree(-5, 1, 3, 1.5));
        group.add(createTree(4.5, -2, 2.8, 1.3));
        group.add(createTree(5, 2, 2.2, 1.0));
        group.add(createTree(-3, 4, 2.0, 0.9));
        group.add(createTree(3, 4.5, 2.6, 1.1));

        // Flowers
        function createFlower(x, z, color, petalCount) {
            const flowerGroup = new THREE.Group();

            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.01, 0.015, 0.3, 6),
                new THREE.MeshStandardMaterial({ color: 0x3a7d32 })
            );
            stem.position.y = 0.15;
            flowerGroup.add(stem);

            const center = new THREE.Mesh(
                new THREE.SphereGeometry(0.04, 8, 8),
                new THREE.MeshStandardMaterial({ color: 0xffdd00 })
            );
            center.position.y = 0.32;
            flowerGroup.add(center);

            const petalMat = new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.6,
                side: THREE.DoubleSide,
            });

            for (let i = 0; i < petalCount; i++) {
                const petal = new THREE.Mesh(
                    new THREE.SphereGeometry(0.05, 6, 6),
                    petalMat
                );
                petal.scale.set(0.5, 1, 0.3);
                const angle = (i / petalCount) * Math.PI * 2;
                petal.position.set(
                    Math.cos(angle) * 0.06,
                    0.32,
                    Math.sin(angle) * 0.06
                );
                petal.rotation.z = Math.PI / 2;
                petal.rotation.y = angle;
                flowerGroup.add(petal);
            }

            flowerGroup.position.set(x, 0, z);
            flowerGroup.userData = {
                swayPhase: Math.random() * Math.PI * 2,
            };
            return flowerGroup;
        }

        const flowers = [];
        const flowerColors = [0xff6b8a, 0xffffff, 0x9b59b6, 0xffeb3b, 0xff9800, 0x3498db];

        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 1.5 + Math.random() * 5;
            const flower = createFlower(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                flowerColors[Math.floor(Math.random() * flowerColors.length)],
                5 + Math.floor(Math.random() * 4)
            );
            flowers.push(flower);
            group.add(flower);
        }

        // Mushrooms
        function createMushroom(x, z, size) {
            const mushroomGroup = new THREE.Group();

            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(size * 0.15, size * 0.2, size * 0.4, 8),
                new THREE.MeshStandardMaterial({ color: 0xf5f5dc })
            );
            stem.position.y = size * 0.2;
            mushroomGroup.add(stem);

            const cap = new THREE.Mesh(
                new THREE.SphereGeometry(size * 0.4, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
                new THREE.MeshStandardMaterial({ color: 0xcc3333 })
            );
            cap.position.y = size * 0.4;
            mushroomGroup.add(cap);

            for (let i = 0; i < 5; i++) {
                const spot = new THREE.Mesh(
                    new THREE.CircleGeometry(size * 0.06, 8),
                    new THREE.MeshBasicMaterial({ color: 0xffffff })
                );
                const theta = Math.random() * Math.PI * 0.4;
                const phi = Math.random() * Math.PI * 2;
                spot.position.set(
                    Math.sin(theta) * Math.cos(phi) * size * 0.38,
                    size * 0.4 + Math.cos(theta) * size * 0.38,
                    Math.sin(theta) * Math.sin(phi) * size * 0.38
                );
                spot.lookAt(mushroomGroup.position.x, size * 0.4, mushroomGroup.position.z);
                mushroomGroup.add(spot);
            }

            mushroomGroup.position.set(x, 0, z);
            return mushroomGroup;
        }

        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 4;
            group.add(createMushroom(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0.15 + Math.random() * 0.15
            ));
        }

        // Butterflies
        const butterflies = [];
        function createButterfly() {
            const butterfly = new THREE.Group();

            const bodyMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
            const body = new THREE.Mesh(
                new THREE.CapsuleGeometry(0.015, 0.06, 4, 6),
                bodyMat
            );
            body.rotation.x = Math.PI / 2;
            butterfly.add(body);

            const wingColor = new THREE.Color().setHSL(Math.random(), 0.8, 0.5);
            const wingMat = new THREE.MeshStandardMaterial({
                color: wingColor,
                roughness: 0.5,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9,
            });

            const wingShape = new THREE.Shape();
            wingShape.moveTo(0, 0);
            wingShape.lineTo(0.08, 0.04);
            wingShape.lineTo(0.06, 0.1);
            wingShape.lineTo(0, 0.06);

            const wingGeo = new THREE.ShapeGeometry(wingShape);

            const leftWing = new THREE.Mesh(wingGeo, wingMat);
            leftWing.position.x = -0.01;
            leftWing.rotation.y = -0.3;
            butterfly.add(leftWing);

            const rightWing = new THREE.Mesh(wingGeo, wingMat.clone());
            rightWing.position.x = 0.01;
            rightWing.rotation.y = Math.PI + 0.3;
            butterfly.add(rightWing);

            butterfly.userData = {
                leftWing,
                rightWing,
                flapSpeed: 8 + Math.random() * 4,
                pathRadius: 1 + Math.random() * 3,
                pathSpeed: 0.3 + Math.random() * 0.3,
                pathPhase: Math.random() * Math.PI * 2,
                baseY: 1 + Math.random() * 2,
                bobSpeed: 1 + Math.random(),
                bobPhase: Math.random() * Math.PI * 2,
            };

            return butterfly;
        }

        for (let i = 0; i < 15; i++) {
            const butterfly = createButterfly();
            butterfly.position.set(
                (Math.random() - 0.5) * 6,
                1 + Math.random() * 2,
                (Math.random() - 0.5) * 6
            );
            butterflies.push(butterfly);
            group.add(butterfly);
        }

        // Bees
        const bees = [];
        function createBee() {
            const bee = new THREE.Group();

            const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffc107 });
            const body = new THREE.Mesh(
                new THREE.CapsuleGeometry(0.025, 0.04, 4, 6),
                bodyMat
            );
            body.rotation.x = Math.PI / 2;
            bee.add(body);

            const stripeMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
            for (let i = 0; i < 2; i++) {
                const stripe = new THREE.Mesh(
                    new THREE.TorusGeometry(0.026, 0.008, 6, 12),
                    stripeMat
                );
                stripe.position.z = -0.015 + i * 0.03;
                stripe.rotation.x = Math.PI / 2;
                bee.add(stripe);
            }

            const wingMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide,
            });
            const wingGeo = new THREE.CircleGeometry(0.03, 8);

            const leftWing = new THREE.Mesh(wingGeo, wingMat);
            leftWing.position.set(-0.02, 0.02, 0);
            leftWing.rotation.z = 0.3;
            bee.add(leftWing);

            const rightWing = new THREE.Mesh(wingGeo, wingMat);
            rightWing.position.set(0.02, 0.02, 0);
            rightWing.rotation.z = -0.3;
            bee.add(rightWing);

            bee.userData = {
                leftWing,
                rightWing,
                targetFlower: null,
                speed: 1 + Math.random() * 0.5,
                hoverTime: 0,
                state: 'flying',
            };

            return bee;
        }

        for (let i = 0; i < 8; i++) {
            const bee = createBee();
            bee.position.set(
                (Math.random() - 0.5) * 4,
                0.5 + Math.random() * 1.5,
                (Math.random() - 0.5) * 4
            );
            bees.push(bee);
            group.add(bee);
        }

        // Small rabbits
        function createRabbit(x, z) {
            const rabbit = new THREE.Group();

            const furMat = new THREE.MeshStandardMaterial({
                color: 0xc9b896,
                roughness: 0.9,
            });

            const body = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 10, 8),
                furMat
            );
            body.scale.set(1, 0.8, 1.3);
            body.position.y = 0.1;
            rabbit.add(body);

            const head = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 8, 6),
                furMat
            );
            head.position.set(0, 0.15, 0.12);
            rabbit.add(head);

            const earMat = furMat.clone();
            earMat.color.setHex(0xffcccc);
            for (let i = 0; i < 2; i++) {
                const ear = new THREE.Mesh(
                    new THREE.CapsuleGeometry(0.02, 0.08, 4, 6),
                    earMat
                );
                ear.position.set(i === 0 ? -0.03 : 0.03, 0.28, 0.1);
                ear.rotation.x = -0.2;
                rabbit.add(ear);
            }

            const tail = new THREE.Mesh(
                new THREE.SphereGeometry(0.04, 6, 6),
                new THREE.MeshStandardMaterial({ color: 0xffffff })
            );
            tail.position.set(0, 0.1, -0.15);
            rabbit.add(tail);

            rabbit.position.set(x, 0, z);
            rabbit.userData = {
                hopPhase: Math.random() * Math.PI * 2,
                hopSpeed: 0.5 + Math.random() * 0.3,
            };
            return rabbit;
        }

        const rabbits = [];
        for (let i = 0; i < 4; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 3;
            const rabbit = createRabbit(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            );
            rabbit.rotation.y = Math.random() * Math.PI * 2;
            rabbits.push(rabbit);
            group.add(rabbit);
        }

        // Pond
        const pondMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a90a4,
            roughness: 0.1,
            metalness: 0.3,
            transparent: true,
            opacity: 0.8,
        });
        const pond = new THREE.Mesh(
            new THREE.CircleGeometry(1, 24),
            pondMaterial
        );
        pond.rotation.x = -Math.PI / 2;
        pond.position.set(2, 0.01, -2);
        group.add(pond);

        // Fish in pond
        const fish = [];
        function createFish() {
            const fishGroup = new THREE.Group();
            const fishMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.05 + Math.random() * 0.1, 0.8, 0.5),
            });

            const body = new THREE.Mesh(
                new THREE.ConeGeometry(0.03, 0.12, 6),
                fishMat
            );
            body.rotation.z = Math.PI / 2;
            fishGroup.add(body);

            const tail = new THREE.Mesh(
                new THREE.ConeGeometry(0.025, 0.04, 4),
                fishMat
            );
            tail.rotation.z = -Math.PI / 2;
            tail.position.x = -0.07;
            fishGroup.add(tail);

            fishGroup.userData = {
                angle: Math.random() * Math.PI * 2,
                radius: 0.3 + Math.random() * 0.5,
                speed: 0.5 + Math.random() * 0.5,
            };

            return fishGroup;
        }

        for (let i = 0; i < 5; i++) {
            const f = createFish();
            f.position.set(2, 0.02, -2);
            fish.push(f);
            group.add(f);
        }

        return { grassBlades, flowers, butterflies, bees, rabbits, fish, pond };
    },

    animate(state, time, deltaTime, group) {
        // Grass swaying
        state.grassBlades.forEach(blade => {
            const b = blade.userData;
            blade.rotation.z = Math.sin(time * b.swaySpeed + b.swayPhase) * 0.15;
        });

        // Flowers swaying gently
        state.flowers.forEach(flower => {
            flower.rotation.z = Math.sin(time * 0.8 + flower.userData.swayPhase) * 0.05;
        });

        // Butterflies
        state.butterflies.forEach(butterfly => {
            const b = butterfly.userData;

            const flap = Math.sin(time * b.flapSpeed) * 0.8;
            b.leftWing.rotation.y = -0.3 - flap;
            b.rightWing.rotation.y = Math.PI + 0.3 + flap;

            const pathAngle = time * b.pathSpeed + b.pathPhase;
            butterfly.position.x = Math.cos(pathAngle) * b.pathRadius;
            butterfly.position.z = Math.sin(pathAngle) * b.pathRadius;
            butterfly.position.y = b.baseY + Math.sin(time * b.bobSpeed + b.bobPhase) * 0.3;

            butterfly.rotation.y = -pathAngle + Math.PI / 2;
        });

        // Bees
        state.bees.forEach(bee => {
            const b = bee.userData;

            const buzz = Math.sin(time * 30) * 0.4;
            b.leftWing.rotation.z = 0.3 + buzz;
            b.rightWing.rotation.z = -0.3 - buzz;

            if (b.state === 'flying') {
                if (!b.targetFlower && state.flowers.length > 0) {
                    b.targetFlower = state.flowers[Math.floor(Math.random() * state.flowers.length)];
                }

                if (b.targetFlower) {
                    const target = b.targetFlower.position;
                    const dx = target.x - bee.position.x;
                    const dy = (target.y + 0.4) - bee.position.y;
                    const dz = target.z - bee.position.z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist > 0.2) {
                        bee.position.x += (dx / dist) * b.speed * deltaTime;
                        bee.position.y += (dy / dist) * b.speed * deltaTime;
                        bee.position.z += (dz / dist) * b.speed * deltaTime;
                        bee.lookAt(target.x, target.y + 0.4, target.z);
                    } else {
                        b.state = 'hovering';
                        b.hoverTime = 1 + Math.random() * 2;
                    }
                }
            } else if (b.state === 'hovering') {
                bee.position.y += Math.sin(time * 5) * 0.002;
                b.hoverTime -= deltaTime;
                if (b.hoverTime <= 0) {
                    b.state = 'flying';
                    b.targetFlower = null;
                }
            }
        });

        // Rabbits
        state.rabbits.forEach(rabbit => {
            const r = rabbit.userData;
            const hop = Math.sin(time * r.hopSpeed + r.hopPhase);
            if (hop > 0.9) {
                rabbit.position.y = (hop - 0.9) * 0.5;
            } else {
                rabbit.position.y = 0;
            }
        });

        // Fish swimming in circles
        state.fish.forEach(f => {
            const fd = f.userData;
            fd.angle += fd.speed * deltaTime;
            f.position.x = 2 + Math.cos(fd.angle) * fd.radius;
            f.position.z = -2 + Math.sin(fd.angle) * fd.radius;
            f.rotation.y = -fd.angle + Math.PI / 2;
        });

        // Pond ripples
        state.pond.scale.x = 1 + Math.sin(time * 0.5) * 0.02;
        state.pond.scale.y = 1 + Math.sin(time * 0.5) * 0.02;
    },

    interact(state, mesh, point, geoType, ctx) {
        // Trees: CylinderGeometry (trunk) or IcosahedronGeometry (canopy)
        if (geoType === 'CylinderGeometry' ||
            (geoType === 'IcosahedronGeometry' && mesh.position.y > 1)) {
            ctx.shakeTree(mesh, point);
        }
        // Mushroom: parent is a group with SphereGeometry cap
        else if (mesh.parent && mesh.parent.isGroup &&
                 mesh.parent.children.some(c => c.geometry &&
                 c.geometry.type === 'SphereGeometry' && c.geometry.parameters &&
                 c.geometry.parameters.phiLength === Math.PI)) {
            ctx.popMushroom(mesh.parent, point);
        }
        // Flowers: groups with multiple small parts
        else if (mesh.parent && mesh.parent.isGroup &&
                 mesh.parent.children.length > 3 &&
                 mesh.parent.userData && mesh.parent.userData.swayPhase !== undefined) {
            ctx.pickFlower(mesh.parent, point);
        }
        // Grass blades
        else if (geoType === 'PlaneGeometry' && mesh.userData && mesh.userData.swayPhase !== undefined) {
            ctx.kickObject(mesh, point);
        }
    },
};
