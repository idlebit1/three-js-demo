import * as THREE from 'three';

export default {
    name: 'serenity',
    label: 'Serenity',

    lighting: {
        background: 0xe8f0f8,
        ambient: { color: 0xffffff, intensity: 0.6 },
        key: { color: 0xfff8f0, intensity: 0.8 },
        extras: [
            { type: 'point', color: 0xfff8f0, intensity: 0.4, distance: 20, position: [0, 4, 0] },
        ],
    },

    create(THREE, group) {
        // Zen sand garden ground
        const sandMat = new THREE.MeshStandardMaterial({
            color: 0xf5f0e6,
            roughness: 0.9,
            metalness: 0.0,
        });
        const sandGround = new THREE.Mesh(
            new THREE.CircleGeometry(10, 48),
            sandMat
        );
        sandGround.rotation.x = -Math.PI / 2;
        sandGround.position.y = -0.1;
        sandGround.receiveShadow = true;
        group.add(sandGround);

        // Zen garden ripple rings
        for (let r = 0; r < 6; r++) {
            const ringGeo = new THREE.TorusGeometry(1 + r * 0.8, 0.02, 8, 64);
            const ringMat = new THREE.MeshStandardMaterial({
                color: 0xe0d8c8,
                roughness: 0.8,
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = 0.01;
            group.add(ring);
        }

        // Smooth stones
        const zenStones = [];
        const stonePositions = [[0, 0], [-1.5, 0.5], [1, -0.8]];
        stonePositions.forEach(([x, z]) => {
            const stoneGeo = new THREE.SphereGeometry(0.3 + Math.random() * 0.2, 16, 12);
            const stoneMat = new THREE.MeshStandardMaterial({
                color: 0x5a5a5a,
                roughness: 0.7,
                metalness: 0.1,
            });
            const stone = new THREE.Mesh(stoneGeo, stoneMat);
            stone.scale.y = 0.6;
            stone.position.set(x, 0.15, z);
            zenStones.push(stone);
            group.add(stone);
        });

        // Floating lotus flowers
        const lotusFlowers = [];
        for (let i = 0; i < 6; i++) {
            const lotusGroup = new THREE.Group();
            const petalMat = new THREE.MeshStandardMaterial({
                color: 0xffccdd,
                roughness: 0.5,
                side: THREE.DoubleSide,
            });
            for (let p = 0; p < 8; p++) {
                const petalGeo = new THREE.SphereGeometry(0.12, 8, 6);
                const petal = new THREE.Mesh(petalGeo, petalMat);
                const pAngle = (p / 8) * Math.PI * 2;
                petal.position.set(Math.cos(pAngle) * 0.15, 0.05, Math.sin(pAngle) * 0.15);
                petal.scale.set(1, 0.3, 0.6);
                petal.rotation.y = pAngle;
                petal.rotation.x = -0.3;
                lotusGroup.add(petal);
            }
            const centerGeo = new THREE.SphereGeometry(0.08, 8, 6);
            const centerMat = new THREE.MeshStandardMaterial({ color: 0xffee88 });
            const center = new THREE.Mesh(centerGeo, centerMat);
            center.position.y = 0.05;
            lotusGroup.add(center);

            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 3;
            lotusGroup.position.set(Math.cos(angle) * radius, 0.02, Math.sin(angle) * radius);
            lotusGroup.userData = {
                floatPhase: Math.random() * Math.PI * 2,
                floatSpeed: 0.3 + Math.random() * 0.2,
            };
            lotusFlowers.push(lotusGroup);
            group.add(lotusGroup);
        }

        // Gentle floating orbs of light
        const calmOrbs = [];
        for (let i = 0; i < 20; i++) {
            const orbGeo = new THREE.SphereGeometry(0.06 + Math.random() * 0.04, 12, 8);
            const orbMat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.4 + Math.random() * 0.3,
            });
            const orb = new THREE.Mesh(orbGeo, orbMat);
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 7;
            orb.position.set(
                Math.cos(angle) * radius,
                0.5 + Math.random() * 4,
                Math.sin(angle) * radius
            );
            orb.userData = {
                basePos: orb.position.clone(),
                floatPhase: Math.random() * Math.PI * 2,
                floatSpeed: 0.2 + Math.random() * 0.2,
                noInteract: true,
            };
            calmOrbs.push(orb);
            group.add(orb);
        }

        // Bamboo wind chimes
        const chimeGroup = new THREE.Group();
        for (let c = 0; c < 5; c++) {
            const chimeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.3 + c * 0.1, 8);
            const chimeMat = new THREE.MeshStandardMaterial({ color: 0xc4a35a });
            const chime = new THREE.Mesh(chimeGeo, chimeMat);
            chime.position.set((c - 2) * 0.15, -0.2 - c * 0.05, 0);
            chime.userData = { swingPhase: c * 0.5 };
            chimeGroup.add(chime);
        }
        chimeGroup.position.set(4, 3, -3);
        group.add(chimeGroup);

        return { zenStones, lotusFlowers, calmOrbs, chimeGroup };
    },

    animate(state, time, deltaTime, group) {
        // Lotus flowers gently floating
        state.lotusFlowers.forEach(lotus => {
            const l = lotus.userData;
            lotus.position.y = 0.02 + Math.sin(time * l.floatSpeed + l.floatPhase) * 0.02;
            lotus.rotation.y = Math.sin(time * 0.1 + l.floatPhase) * 0.05;
        });

        // Calm orbs floating
        state.calmOrbs.forEach(orb => {
            const o = orb.userData;
            orb.position.x = o.basePos.x + Math.sin(time * o.floatSpeed + o.floatPhase) * 0.3;
            orb.position.y = o.basePos.y + Math.sin(time * o.floatSpeed * 0.7 + o.floatPhase) * 0.2;
            orb.position.z = o.basePos.z + Math.cos(time * o.floatSpeed * 0.5 + o.floatPhase) * 0.3;
        });

        // Wind chimes gentle sway
        state.chimeGroup.children.forEach(chime => {
            if (chime.userData && chime.userData.swingPhase !== undefined) {
                chime.rotation.z = Math.sin(time * 0.5 + chime.userData.swingPhase) * 0.1;
            }
        });

        // Gentle breathing of the scene light
        if (state._extraLights && state._extraLights[0]) {
            state._extraLights[0].intensity = 0.35 + Math.sin(time * 0.3) * 0.05;
        }
    },

    interact(state, mesh, point, geoType, ctx) {
        // Lotus flowers glow
        if (mesh.parent && mesh.parent.userData && mesh.parent.userData.floatPhase !== undefined) {
            ctx.playSound('flowerPick');
        }
    },
};
