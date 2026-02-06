// Sanctuary — grand float world based on Hearth
// Carpet floor (no trees) + rugs + cabin walls + pillows + family silhouettes + warm orbs
import { createGrandTerrain, animateGrandTerrain } from './grand-terrain.js';

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
        const terrain = createGrandTerrain(THREE, group, { showGround: false, showTrees: false });

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

        return { ...terrain };
    },

    animate(state, time, deltaTime, group) {
        animateGrandTerrain(state, time, deltaTime);
    },

    interact(state, mesh, point, geoType, ctx) {
        if (geoType === 'BoxGeometry') {
            ctx.kickObject(mesh, point);
        } else if (geoType === 'SphereGeometry') {
            ctx.squishObject(mesh, point);
        }
    },
};
