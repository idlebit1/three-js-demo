// Eruption — grand float world based on Simmer
// Tiled floor (no trees) + cracked tiles + furniture + fissures + steam + toys + calm zone
import { createGrandTerrain, animateGrandTerrain } from './grand-terrain.js';

export default {
    name: 'eruption',
    label: 'Eruption',
    sphereInteractionType: 'float',

    lighting: {
        background: 0x331111,
        ambient: { color: 0xff6644, intensity: 0.3 },
        key: { color: 0xff4422, intensity: 1.0 },
        extras: [],
    },

    skyColor(altitude) {
        const color = { h: 0, s: 0, l: 0 };
        if (altitude < 60) {
            color.h = 0.0; color.s = 0.65; color.l = 0.1 + altitude * 0.002;
        } else if (altitude < 120) {
            color.h = 0.0 + (altitude - 60) * 0.002; color.s = 0.5; color.l = 0.22 - (altitude - 60) * 0.001;
        } else {
            color.h = 0.1; color.s = 0.3; color.l = Math.max(0.04, 0.16 - (altitude - 120) * 0.001);
        }
        return color;
    },

    create(THREE, group) {
        const terrain = createGrandTerrain(THREE, group, { showGround: false, showTrees: false });

        // Tiled floor
        const simmerGrandFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(160, 160),
            new THREE.MeshStandardMaterial({ color: 0x4a3a35, roughness: 0.8 })
        );
        simmerGrandFloor.rotation.x = -Math.PI / 2;
        simmerGrandFloor.position.y = -0.5;
        group.add(simmerGrandFloor);

        // Tile grid lines (cracked appearance)
        for (let i = 0; i < 16; i++) {
            const tileLine = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.02, 140),
                new THREE.MeshStandardMaterial({ color: 0x2a1a15 })
            );
            tileLine.position.set((i - 8) * 10, -0.45, 0);
            group.add(tileLine);
            const crossLine = tileLine.clone();
            crossLine.rotation.y = Math.PI / 2;
            crossLine.position.set(0, -0.45, (i - 8) * 10);
            group.add(crossLine);
        }

        // Overturned furniture
        for (let i = 0; i < 8; i++) {
            const furniture = new THREE.Mesh(
                new THREE.BoxGeometry(2 + Math.random() * 2, 1, 1 + Math.random()),
                new THREE.MeshStandardMaterial({ color: 0x6b5b4f })
            );
            furniture.position.set(
                (Math.random() - 0.5) * 50, 0.5, (Math.random() - 0.5) * 50
            );
            furniture.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
            group.add(furniture);
        }

        // Pressure cracks/fissures in floor (glowing red)
        for (let i = 0; i < 10; i++) {
            const crack = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 0.1, 15 + Math.random() * 20),
                new THREE.MeshBasicMaterial({ color: 0xff4422 })
            );
            crack.rotation.y = Math.random() * Math.PI;
            crack.position.set((Math.random() - 0.5) * 60, -0.3, (Math.random() - 0.5) * 60);
            group.add(crack);
        }

        // Rising steam/pressure vents
        for (let i = 0; i < 30; i++) {
            const steam = new THREE.Mesh(
                new THREE.CylinderGeometry(0.5, 1.5, 8 + Math.random() * 15, 8),
                new THREE.MeshBasicMaterial({ color: 0xff6644, transparent: true, opacity: 0.3 })
            );
            steam.position.set(
                (Math.random() - 0.5) * 50,
                10 + Math.random() * 40,
                (Math.random() - 0.5) * 50
            );
            group.add(steam);
        }

        // Scattered toys that got thrown high
        const toys = [];
        for (let i = 0; i < 25; i++) {
            const toy = new THREE.Mesh(
                new THREE.BoxGeometry(0.3 + Math.random() * 0.3, 0.3 + Math.random() * 0.3, 0.3 + Math.random() * 0.3),
                new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(Math.random() * 0.1, 0.7, 0.5) })
            );
            toy.position.set(
                (Math.random() - 0.5) * 60,
                20 + Math.random() * 80,
                (Math.random() - 0.5) * 60
            );
            toy.userData = { tumbleSpeed: 1 + Math.random() * 2 };
            toys.push(toy);
            group.add(toy);
        }

        // Calm zone at very high altitude
        for (let i = 0; i < 10; i++) {
            const calmOrb = new THREE.Mesh(
                new THREE.SphereGeometry(2),
                new THREE.MeshBasicMaterial({ color: 0x88aaff, transparent: true, opacity: 0.3 })
            );
            calmOrb.position.set(
                (Math.random() - 0.5) * 40,
                120 + Math.random() * 40,
                (Math.random() - 0.5) * 40
            );
            group.add(calmOrb);
        }

        return { ...terrain, toys };
    },

    animate(state, time, deltaTime, group) {
        animateGrandTerrain(state, time, deltaTime);

        // Tumbling toys
        state.toys.forEach(toy => {
            const u = toy.userData;
            toy.rotation.x += u.tumbleSpeed * deltaTime;
            toy.rotation.z += u.tumbleSpeed * deltaTime * 0.7;
        });
    },

    interact(state, mesh, point, geoType, ctx) {
        if (geoType === 'BoxGeometry') {
            ctx.kickObject(mesh, point);
        }
    },
};
