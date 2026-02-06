// Reverie — grand float world based on Drift
// Wooden floor (no trees) + bookshelves + floating papers + warm motes + clocks
import { createGrandTerrain, animateGrandTerrain } from './grand-terrain.js';

export default {
    name: 'reverie',
    label: 'Reverie',
    sphereInteractionType: 'float',

    lighting: {
        background: 0x4a3f35,
        ambient: { color: 0xddc4a0, intensity: 0.5 },
        key: { color: 0xffddaa, intensity: 1.2 },
        extras: [],
    },

    skyColor(altitude) {
        const color = { h: 0, s: 0, l: 0 };
        if (altitude < 50) {
            color.h = 0.08; color.s = 0.4; color.l = 0.22 + altitude * 0.002;
        } else if (altitude < 120) {
            color.h = 0.08 + (altitude - 50) * 0.004; color.s = 0.35; color.l = 0.32 - (altitude - 50) * 0.001;
        } else {
            color.h = 0.75; color.s = 0.25; color.l = Math.max(0.08, 0.18 - (altitude - 120) * 0.001);
        }
        return color;
    },

    create(THREE, group) {
        const terrain = createGrandTerrain(THREE, group, { showGround: false, showTrees: false });

        // Wooden floor
        const driftGrandFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(150, 150),
            new THREE.MeshStandardMaterial({ color: 0x6b5344, roughness: 0.9 })
        );
        driftGrandFloor.rotation.x = -Math.PI / 2;
        driftGrandFloor.position.y = -0.5;
        group.add(driftGrandFloor);

        // Distant bookshelves/walls
        for (let i = 0; i < 6; i++) {
            const wall = new THREE.Mesh(
                new THREE.BoxGeometry(30, 20, 2),
                new THREE.MeshStandardMaterial({ color: 0x4a3f35, transparent: true, opacity: 0.5 })
            );
            const angle = (i / 6) * Math.PI * 2;
            wall.position.set(Math.cos(angle) * 60, 10, Math.sin(angle) * 60);
            wall.rotation.y = angle;
            group.add(wall);
        }

        // Floating papers
        const papers = [];
        for (let i = 0; i < 40; i++) {
            const paper = new THREE.Mesh(
                new THREE.PlaneGeometry(1 + Math.random(), 0.7 + Math.random() * 0.5),
                new THREE.MeshStandardMaterial({ color: 0xddc4a0, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
            );
            paper.position.set(
                (Math.random() - 0.5) * 60,
                10 + Math.random() * 120,
                (Math.random() - 0.5) * 60
            );
            paper.rotation.set(Math.random(), Math.random() * Math.PI, Math.random());
            paper.userData = { driftSpeed: 0.1 + Math.random() * 0.1 };
            papers.push(paper);
            group.add(paper);
        }

        // Warm light motes
        for (let i = 0; i < 50; i++) {
            const mote = new THREE.Mesh(
                new THREE.SphereGeometry(0.1 + Math.random() * 0.3),
                new THREE.MeshBasicMaterial({ color: 0xffdd99, transparent: true, opacity: 0.5 })
            );
            mote.position.set(
                (Math.random() - 0.5) * 50,
                5 + Math.random() * 130,
                (Math.random() - 0.5) * 50
            );
            group.add(mote);
        }

        // Floating clocks
        const clocks = [];
        for (let i = 0; i < 8; i++) {
            const clock = new THREE.Mesh(
                new THREE.CylinderGeometry(1.5, 1.5, 0.3, 24),
                new THREE.MeshStandardMaterial({ color: 0xc4a882 })
            );
            clock.rotation.x = Math.PI / 2;
            clock.position.set(
                (Math.random() - 0.5) * 50,
                30 + Math.random() * 80,
                (Math.random() - 0.5) * 50
            );
            clock.userData = { rotSpeed: 0.02 + Math.random() * 0.02 };
            clocks.push(clock);
            group.add(clock);
        }

        return { ...terrain, papers, clocks };
    },

    animate(state, time, deltaTime, group) {
        animateGrandTerrain(state, time, deltaTime);

        // Drifting papers
        state.papers.forEach(paper => {
            const u = paper.userData;
            paper.rotation.z += u.driftSpeed * deltaTime;
            paper.position.y += Math.sin(time * 0.5) * 0.01;
        });

        // Rotating clocks
        state.clocks.forEach(clock => {
            const u = clock.userData;
            clock.rotation.y += u.rotSpeed * deltaTime;
        });
    },

    interact(state, mesh, point, geoType, ctx) {
        if (geoType === 'PlaneGeometry') {
            ctx.kickObject(mesh, point);
        } else if (geoType === 'BoxGeometry') {
            ctx.kickObject(mesh, point);
        }
    },
};
