// Ascent — grand float world based on Bamboo
// Green ground + trees + giant bamboo stalks + floating lanterns
import { createGrandTerrain, animateGrandTerrain } from './grand-terrain.js';

export default {
    name: 'ascent',
    label: 'Ascent',
    sphereInteractionType: 'float',

    lighting: {
        background: 0x87ceeb,
        ambient: { color: 0xffffff, intensity: 0.4 },
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

        // Giant bamboo stalks rising into clouds
        for (let i = 0; i < 20; i++) {
            const height = 30 + Math.random() * 80;
            const bambooGiant = new THREE.Mesh(
                new THREE.CylinderGeometry(0.5, 0.8, height, 12),
                new THREE.MeshStandardMaterial({ color: 0x4a7c23 })
            );
            const angle = Math.random() * Math.PI * 2;
            const dist = 15 + Math.random() * 40;
            bambooGiant.position.set(Math.cos(angle) * dist, height / 2, Math.sin(angle) * dist);
            group.add(bambooGiant);
        }

        // Floating lanterns
        const lanterns = [];
        for (let i = 0; i < 30; i++) {
            const lantern = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0xffaa44, transparent: true, opacity: 0.8 })
            );
            lantern.position.set(
                (Math.random() - 0.5) * 60,
                20 + Math.random() * 100,
                (Math.random() - 0.5) * 60
            );
            lantern.userData = { baseY: lantern.position.y, floatSpeed: 0.3 + Math.random() * 0.2 };
            lanterns.push(lantern);
            group.add(lantern);
        }

        return { ...terrain, lanterns };
    },

    animate(state, time, deltaTime, group) {
        animateGrandTerrain(state, time, deltaTime);

        // Floating lanterns bob
        state.lanterns.forEach(lantern => {
            const u = lantern.userData;
            lantern.position.y = u.baseY + Math.sin(time * u.floatSpeed) * 2;
        });
    },

    interact(state, mesh, point, geoType, ctx) {
        if (geoType === 'CylinderGeometry' || geoType === 'ConeGeometry') {
            ctx.shakeTree(mesh, point);
        }
    },
};
