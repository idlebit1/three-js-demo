import * as THREE from 'three';

export default {
    name: 'melancholy',
    label: 'Melancholy',

    lighting: {
        background: 0x2a3040,
        ambient: { color: 0x8090a0, intensity: 0.4 },
        key: { color: 0xaabbcc, intensity: 0.5 },
        extras: [],
    },

    create(THREE, group) {
        // Wet ground with puddle reflections
        const wetGroundMat = new THREE.MeshStandardMaterial({
            color: 0x3a4050,
            roughness: 0.4,
            metalness: 0.3,
        });
        const wetGround = new THREE.Mesh(
            new THREE.CircleGeometry(10, 48),
            wetGroundMat
        );
        wetGround.rotation.x = -Math.PI / 2;
        wetGround.position.y = -0.1;
        wetGround.receiveShadow = true;
        group.add(wetGround);

        // Puddles
        const puddles = [];
        for (let i = 0; i < 8; i++) {
            const puddleSize = 0.5 + Math.random() * 1;
            const puddleMat = new THREE.MeshStandardMaterial({
                color: 0x4a5a70,
                roughness: 0.1,
                metalness: 0.8,
                transparent: true,
                opacity: 0.7,
            });
            const puddle = new THREE.Mesh(
                new THREE.CircleGeometry(puddleSize, 24),
                puddleMat
            );
            const angle = Math.random() * Math.PI * 2;
            const radius = 1 + Math.random() * 5;
            puddle.position.set(Math.cos(angle) * radius, 0.01, Math.sin(angle) * radius);
            puddle.rotation.x = -Math.PI / 2;
            puddle.userData = { ripplePhase: Math.random() * Math.PI * 2 };
            puddles.push(puddle);
            group.add(puddle);
        }

        // Rain particles
        const raindrops = [];
        for (let i = 0; i < 200; i++) {
            const rainGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 4);
            const rainMat = new THREE.MeshBasicMaterial({
                color: 0x8899aa,
                transparent: true,
                opacity: 0.4,
            });
            const rain = new THREE.Mesh(rainGeo, rainMat);
            rain.position.set(
                (Math.random() - 0.5) * 16,
                Math.random() * 10,
                (Math.random() - 0.5) * 16
            );
            rain.userData = {
                speed: 8 + Math.random() * 4,
                noInteract: true,
            };
            raindrops.push(rain);
            group.add(rain);
        }

        // Wilted flowers
        for (let i = 0; i < 12; i++) {
            const flowerGroup = new THREE.Group();
            // Bent stem
            const stemGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.4, 6);
            const stemMat = new THREE.MeshStandardMaterial({ color: 0x4a5a3a });
            const stem = new THREE.Mesh(stemGeo, stemMat);
            stem.position.y = 0.2;
            stem.rotation.z = 0.3 + Math.random() * 0.3; // Drooping
            flowerGroup.add(stem);
            // Wilted petals
            const petalMat = new THREE.MeshStandardMaterial({ color: 0x7a6a6a });
            for (let p = 0; p < 5; p++) {
                const petal = new THREE.Mesh(
                    new THREE.SphereGeometry(0.06, 6, 6),
                    petalMat
                );
                const pAngle = (p / 5) * Math.PI * 2;
                petal.position.set(
                    Math.cos(pAngle) * 0.08,
                    0.35,
                    Math.sin(pAngle) * 0.08
                );
                petal.position.y -= 0.05; // Drooping down
                petal.scale.y = 0.5;
                flowerGroup.add(petal);
            }
            const angle = Math.random() * Math.PI * 2;
            const radius = 1 + Math.random() * 5;
            flowerGroup.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            group.add(flowerGroup);
        }

        // Fog layers
        for (let i = 0; i < 5; i++) {
            const fogGeo = new THREE.PlaneGeometry(20, 3);
            const fogMat = new THREE.MeshBasicMaterial({
                color: 0x6a7a8a,
                transparent: true,
                opacity: 0.15,
                side: THREE.DoubleSide,
            });
            const fog = new THREE.Mesh(fogGeo, fogMat);
            fog.position.y = 0.5 + i * 0.8;
            fog.rotation.x = Math.PI / 2;
            fog.userData = { driftPhase: Math.random() * Math.PI * 2, noInteract: true };
            group.add(fog);
        }

        // Bare tree
        const bareTreeGroup = new THREE.Group();
        const trunkGeo = new THREE.CylinderGeometry(0.15, 0.25, 2, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3a3530 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1;
        bareTreeGroup.add(trunk);
        // Dead branches
        for (let b = 0; b < 6; b++) {
            const branchGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.8, 5);
            const branch = new THREE.Mesh(branchGeo, trunkMat);
            const bAngle = (b / 6) * Math.PI * 2;
            branch.position.set(Math.cos(bAngle) * 0.3, 1.5 + Math.random() * 0.5, Math.sin(bAngle) * 0.3);
            branch.rotation.z = 0.5 + Math.random() * 0.5;
            branch.rotation.y = bAngle;
            bareTreeGroup.add(branch);
        }
        bareTreeGroup.position.set(-3, 0, -2);
        group.add(bareTreeGroup);

        return { raindrops, puddles };
    },

    animate(state, time, deltaTime, group) {
        // Rain falling
        state.raindrops.forEach(rain => {
            rain.position.y -= rain.userData.speed * deltaTime;
            if (rain.position.y < 0) {
                rain.position.y = 10;
                rain.position.x = (Math.random() - 0.5) * 16;
                rain.position.z = (Math.random() - 0.5) * 16;
            }
        });

        // Puddle ripples
        state.puddles.forEach(puddle => {
            const ripple = Math.sin(time * 3 + puddle.userData.ripplePhase);
            puddle.scale.x = 1 + ripple * 0.03;
            puddle.scale.y = 1 + ripple * 0.03;
        });

        // Fog drifting
        group.children.forEach(child => {
            if (child.userData && child.userData.driftPhase !== undefined) {
                child.position.x = Math.sin(time * 0.1 + child.userData.driftPhase) * 2;
            }
        });
    },

    interact(state, mesh, point, geoType, playSound) {
        // Puddles ripple
        if (geoType === 'CircleGeometry' && mesh.userData && mesh.userData.ripplePhase !== undefined) {
            playSound('bubblePop');
            mesh.scale.setScalar(1.2);
            setTimeout(() => mesh.scale.setScalar(1), 200);
        }
        // Wilted flowers sway when tapped
        else if (geoType === 'SphereGeometry' || geoType === 'CylinderGeometry') {
            playSound('bubblePop');
            const flower = mesh.parent;
            if (flower && flower.isGroup) {
                const origZ = flower.rotation.z;
                flower.rotation.z += 0.3;
                setTimeout(() => { flower.rotation.z = origZ; }, 300);
            }
        }
    },
};
