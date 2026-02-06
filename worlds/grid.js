// Grid — grand float world based on Voltage
// Circuit floor (no trees) + grid lines + pylons + storm clouds + satellites
import { createGrandTerrain, animateGrandTerrain } from './grand-terrain.js';

export default {
    name: 'grid',
    label: 'The Grid',
    sphereInteractionType: 'float',

    lighting: {
        background: 0x0a0a0f,
        ambient: { color: 0x8888aa, intensity: 0.2 },
        key: { color: 0x4466ff, intensity: 1.0 },
        extras: [],
    },

    skyColor(altitude) {
        const color = { h: 0, s: 0, l: 0 };
        if (altitude < 50) {
            color.h = 0.6; color.s = 0.4; color.l = 0.06 + altitude * 0.002;
        } else if (altitude < 120) {
            color.h = 0.55; color.s = 0.5; color.l = 0.16 + Math.sin(altitude * 0.1) * 0.05;
        } else {
            color.h = 0.58; color.s = 0.3; color.l = Math.max(0.02, 0.1 - (altitude - 120) * 0.001);
        }
        return color;
    },

    create(THREE, group) {
        const terrain = createGrandTerrain(THREE, group, { showGround: false, showTrees: false });

        // Dark metallic grid floor
        const voltageGrandFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 200),
            new THREE.MeshStandardMaterial({ color: 0x0a0a15, metalness: 0.7, roughness: 0.3 })
        );
        voltageGrandFloor.rotation.x = -Math.PI / 2;
        voltageGrandFloor.position.y = -0.5;
        group.add(voltageGrandFloor);

        // Glowing grid lines on floor
        for (let i = 0; i < 20; i++) {
            const gridLine = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.05, 150),
                new THREE.MeshBasicMaterial({ color: 0x4466ff })
            );
            gridLine.position.set((i - 10) * 10, -0.4, 0);
            group.add(gridLine);
            const crossLine = gridLine.clone();
            crossLine.rotation.y = Math.PI / 2;
            crossLine.position.set(0, -0.4, (i - 10) * 10);
            group.add(crossLine);
        }

        // Electric pylons/towers
        for (let i = 0; i < 8; i++) {
            const pylon = new THREE.Group();
            const tower = new THREE.Mesh(
                new THREE.CylinderGeometry(0.5, 1, 40, 6),
                new THREE.MeshStandardMaterial({ color: 0x333355, metalness: 0.9 })
            );
            pylon.add(tower);
            const topGlow = new THREE.Mesh(
                new THREE.SphereGeometry(1.5, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0x88aaff })
            );
            topGlow.position.y = 20;
            pylon.add(topGlow);
            const angle = (i / 8) * Math.PI * 2;
            const dist = 45 + Math.random() * 20;
            pylon.position.set(Math.cos(angle) * dist, 20, Math.sin(angle) * dist);
            group.add(pylon);
        }

        // Electric storm clouds
        for (let i = 0; i < 15; i++) {
            const stormCloud = new THREE.Mesh(
                new THREE.IcosahedronGeometry(4 + Math.random() * 3, 1),
                new THREE.MeshStandardMaterial({ color: 0x222244, transparent: true, opacity: 0.8 })
            );
            stormCloud.position.set(
                (Math.random() - 0.5) * 70,
                30 + Math.random() * 60,
                (Math.random() - 0.5) * 70
            );
            group.add(stormCloud);
        }

        // Satellites/tech debris
        const satellites = [];
        for (let i = 0; i < 12; i++) {
            const satellite = new THREE.Group();
            const body = new THREE.Mesh(
                new THREE.BoxGeometry(1, 0.5, 0.5),
                new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9 })
            );
            satellite.add(body);
            const panel1 = new THREE.Mesh(
                new THREE.BoxGeometry(2, 0.05, 1),
                new THREE.MeshBasicMaterial({ color: 0x4444aa })
            );
            panel1.position.x = 1.5;
            satellite.add(panel1);
            const panel2 = panel1.clone();
            panel2.position.x = -1.5;
            satellite.add(panel2);
            satellite.position.set(
                (Math.random() - 0.5) * 60,
                80 + Math.random() * 80,
                (Math.random() - 0.5) * 60
            );
            satellite.userData = { orbitSpeed: 0.1 + Math.random() * 0.1 };
            satellites.push(satellite);
            group.add(satellite);
        }

        return { ...terrain, satellites };
    },

    animate(state, time, deltaTime, group) {
        animateGrandTerrain(state, time, deltaTime);

        // Orbiting satellites
        state.satellites.forEach(satellite => {
            satellite.rotation.y += satellite.userData.orbitSpeed * deltaTime;
        });
    },

    interact(state, mesh, point, geoType, ctx) {
        if (geoType === 'IcosahedronGeometry') {
            ctx.breakRock(mesh, point);
        } else if (geoType === 'BoxGeometry') {
            ctx.zapObject(mesh, point);
        }
    },
};
