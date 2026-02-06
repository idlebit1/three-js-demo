// Canopy — grand float world based on Glade
// Green ground + trees + giant flowers + bird flocks + giant butterflies
import { createGrandTerrain, animateGrandTerrain } from './grand-terrain.js';

export default {
    name: 'canopy',
    label: 'Canopy',
    sphereInteractionType: 'float',

    lighting: {
        background: 0x87ceeb,
        ambient: { color: 0xffffff, intensity: 0.5 },
        key: { color: 0xfff5e6, intensity: 1.5 },
        extras: [],
    },

    skyColor(altitude) {
        const color = { h: 0, s: 0, l: 0 };
        if (altitude < 30) {
            color.h = 0.55; color.s = 0.6; color.l = 0.7 - altitude * 0.004;
        } else if (altitude < 100) {
            color.h = 0.58; color.s = 0.5; color.l = 0.58 - (altitude - 30) * 0.003;
        } else {
            color.h = 0.68; color.s = 0.4; color.l = Math.max(0.06, 0.37 - (altitude - 100) * 0.002);
        }
        return color;
    },

    create(THREE, group) {
        const terrain = createGrandTerrain(THREE, group, { showGround: true, showTrees: true });

        // Giant flowers
        for (let i = 0; i < 15; i++) {
            const giantFlower = new THREE.Group();
            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.5, 30 + Math.random() * 40, 8),
                new THREE.MeshStandardMaterial({ color: 0x3a7d32 })
            );
            giantFlower.add(stem);
            const petals = new THREE.Mesh(
                new THREE.SphereGeometry(3 + Math.random() * 2, 8, 6),
                new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6) })
            );
            petals.position.y = 20 + Math.random() * 20;
            petals.scale.y = 0.5;
            giantFlower.add(petals);
            const angle = Math.random() * Math.PI * 2;
            const dist = 15 + Math.random() * 35;
            giantFlower.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
            group.add(giantFlower);
        }

        // Flocks of birds
        const flockBirds = [];
        for (let i = 0; i < 20; i++) {
            const bird = new THREE.Mesh(
                new THREE.ConeGeometry(0.3, 1, 4),
                new THREE.MeshStandardMaterial({ color: 0x333333 })
            );
            bird.rotation.x = Math.PI / 2;
            bird.position.set(
                (Math.random() - 0.5) * 60,
                15 + Math.random() * 80,
                (Math.random() - 0.5) * 60
            );
            bird.userData = { flockAngle: Math.random() * Math.PI * 2, flockRadius: 5 + Math.random() * 15, flockSpeed: 0.2 + Math.random() * 0.2 };
            flockBirds.push(bird);
            group.add(bird);
        }

        // Giant butterflies
        const butterflies = [];
        for (let i = 0; i < 10; i++) {
            const bigButterfly = new THREE.Mesh(
                new THREE.PlaneGeometry(4, 3),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8
                })
            );
            bigButterfly.position.set(
                (Math.random() - 0.5) * 50,
                40 + Math.random() * 70,
                (Math.random() - 0.5) * 50
            );
            bigButterfly.userData = { flapPhase: Math.random() * Math.PI * 2 };
            butterflies.push(bigButterfly);
            group.add(bigButterfly);
        }

        return { ...terrain, flockBirds, butterflies };
    },

    animate(state, time, deltaTime, group) {
        animateGrandTerrain(state, time, deltaTime);

        // Flocking birds
        state.flockBirds.forEach(bird => {
            const u = bird.userData;
            u.flockAngle += u.flockSpeed * deltaTime;
            bird.position.x += Math.cos(u.flockAngle) * 0.1;
            bird.position.z += Math.sin(u.flockAngle) * 0.1;
            bird.rotation.y = -u.flockAngle;
        });

        // Giant butterflies flapping
        state.butterflies.forEach(butterfly => {
            const u = butterfly.userData;
            butterfly.rotation.x = Math.sin(time * 3 + u.flapPhase) * 0.3;
        });
    },

    interact(state, mesh, point, geoType, ctx) {
        if (geoType === 'CylinderGeometry' || geoType === 'ConeGeometry') {
            ctx.shakeTree(mesh, point);
        } else if (geoType === 'SphereGeometry') {
            ctx.pickFlower(mesh, point);
        }
    },
};
