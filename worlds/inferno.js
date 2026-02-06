// Inferno — grand float world based on Lava
// Volcanic ground (no trees) + volcanoes + lava rivers + ash clouds + phoenixes + obsidian shards
import { createGrandTerrain, animateGrandTerrain } from './grand-terrain.js';

export default {
    name: 'inferno',
    label: 'Inferno',
    sphereInteractionType: 'float',

    lighting: {
        background: 0x1a0505,
        ambient: { color: 0xff4422, intensity: 0.3 },
        key: { color: 0xff6600, intensity: 1.0 },
        extras: [],
    },

    skyColor(altitude) {
        const color = { h: 0, s: 0, l: 0 };
        if (altitude < 40) {
            color.h = 0.02; color.s = 0.6; color.l = 0.12 + altitude * 0.002;
        } else if (altitude < 100) {
            color.h = 0.0; color.s = 0.5; color.l = 0.2 - (altitude - 40) * 0.001;
        } else {
            color.h = 0.0; color.s = 0.3; color.l = Math.max(0.02, 0.14 - (altitude - 100) * 0.001);
        }
        return color;
    },

    create(THREE, group) {
        const terrain = createGrandTerrain(THREE, group, { showGround: false, showTrees: false });

        // Volcanic ground
        const lavaGrandGround = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 200),
            new THREE.MeshStandardMaterial({ color: 0x1a0a0a, roughness: 0.95 })
        );
        lavaGrandGround.rotation.x = -Math.PI / 2;
        lavaGrandGround.position.y = -0.5;
        group.add(lavaGrandGround);

        // Distant volcanoes
        for (let i = 0; i < 8; i++) {
            const volcano = new THREE.Mesh(
                new THREE.ConeGeometry(12 + Math.random() * 8, 25 + Math.random() * 15, 8),
                new THREE.MeshStandardMaterial({ color: 0x2a1a1a })
            );
            const angle = (i / 8) * Math.PI * 2;
            const dist = 50 + Math.random() * 30;
            volcano.position.set(Math.cos(angle) * dist, 12, Math.sin(angle) * dist);
            const lavaTop = new THREE.Mesh(
                new THREE.SphereGeometry(3, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2),
                new THREE.MeshBasicMaterial({ color: 0xff4400 })
            );
            lavaTop.position.y = 12;
            volcano.add(lavaTop);
            group.add(volcano);
        }

        // Lava rivers on ground
        for (let i = 0; i < 5; i++) {
            const river = new THREE.Mesh(
                new THREE.PlaneGeometry(3, 40 + Math.random() * 30),
                new THREE.MeshBasicMaterial({ color: 0xff3300 })
            );
            river.rotation.x = -Math.PI / 2;
            river.position.set((Math.random() - 0.5) * 60, 0.1, (Math.random() - 0.5) * 60);
            river.rotation.z = Math.random() * Math.PI;
            group.add(river);
        }

        // Volcanic ash clouds
        for (let i = 0; i < 25; i++) {
            const ashCloud = new THREE.Mesh(
                new THREE.SphereGeometry(3 + Math.random() * 4, 8, 6),
                new THREE.MeshStandardMaterial({ color: 0x333333, transparent: true, opacity: 0.7 })
            );
            ashCloud.position.set(
                (Math.random() - 0.5) * 80,
                15 + Math.random() * 50,
                (Math.random() - 0.5) * 80
            );
            group.add(ashCloud);
        }

        // Fire phoenixes
        const phoenixes = [];
        for (let i = 0; i < 8; i++) {
            const phoenix = new THREE.Mesh(
                new THREE.ConeGeometry(1, 3, 6),
                new THREE.MeshBasicMaterial({ color: 0xff4400 })
            );
            phoenix.rotation.x = Math.PI / 2;
            phoenix.position.set(0, 40 + Math.random() * 60, 0);
            phoenix.userData = { angle: Math.random() * Math.PI * 2, radius: 10 + Math.random() * 20, speed: 0.3 + Math.random() * 0.2 };
            phoenixes.push(phoenix);
            group.add(phoenix);
        }

        // Floating obsidian shards
        const shards = [];
        for (let i = 0; i < 15; i++) {
            const shard = new THREE.Mesh(
                new THREE.OctahedronGeometry(1 + Math.random()),
                new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.8, roughness: 0.2 })
            );
            shard.position.set(
                (Math.random() - 0.5) * 50,
                50 + Math.random() * 80,
                (Math.random() - 0.5) * 50
            );
            shard.userData = { rotSpeed: 0.5 + Math.random() * 0.5 };
            shards.push(shard);
            group.add(shard);
        }

        return { ...terrain, phoenixes, shards };
    },

    animate(state, time, deltaTime, group) {
        animateGrandTerrain(state, time, deltaTime);

        // Phoenixes circling
        state.phoenixes.forEach(phoenix => {
            const u = phoenix.userData;
            u.angle += u.speed * deltaTime;
            phoenix.position.x = Math.cos(u.angle) * u.radius;
            phoenix.position.z = Math.sin(u.angle) * u.radius;
            phoenix.rotation.y = -u.angle;
        });

        // Rotating shards
        state.shards.forEach(shard => {
            const u = shard.userData;
            shard.rotation.y += u.rotSpeed * deltaTime;
            shard.rotation.x += u.rotSpeed * deltaTime * 0.5;
        });
    },

    interact(state, mesh, point, geoType, ctx) {
        if (geoType === 'ConeGeometry') {
            ctx.breakRock(mesh, point);
        } else if (geoType === 'OctahedronGeometry') {
            ctx.breakRock(mesh, point);
        }
    },
};
