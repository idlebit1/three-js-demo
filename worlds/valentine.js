// Valentine — grand float world
// Rose floor + heart archways + floating hearts + rose petals + cupid arrows + candy hearts + love letters
import { createGrandTerrain, animateGrandTerrain } from './grand-terrain.js';

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
        const terrain = createGrandTerrain(THREE, group, { showGround: false, showTrees: false });

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
            // Two pillars
            for (const side of [-1, 1]) {
                const pillar = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.8, 1, 18, 8),
                    new THREE.MeshStandardMaterial({ color: 0xcc4466 })
                );
                pillar.position.set(side * 4, 9, 0);
                arch.add(pillar);
            }
            // Top arch (torus arc)
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

        return { ...terrain, hearts, petals, arrows };
    },

    animate(state, time, deltaTime, group) {
        animateGrandTerrain(state, time, deltaTime);

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
