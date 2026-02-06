import * as THREE from 'three';

export default {
    name: 'lava',
    label: 'Lava',

    lighting: {
        background: 0x1a0505,
        ambient: { color: 0xff4422, intensity: 0.3 },
        key: { color: 0xfff5e6, intensity: 1.5 },
        extras: [],
    },

    create(THREE, group) {
        // Ground profile (shared shape)
        const groundProfile = [
            new THREE.Vector2(0, -0.3),
            new THREE.Vector2(2.8, -0.25),
            new THREE.Vector2(3.0, -0.1),
            new THREE.Vector2(3.1, 0),
            new THREE.Vector2(3.0, 0.1),
            new THREE.Vector2(2.5, 0.15),
            new THREE.Vector2(0, 0.18),
        ];

        // Volcanic rock ground
        const lavaGroundMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a1a1a,
            roughness: 0.95,
            metalness: 0.1,
        });

        const latheGeo = new THREE.LatheGeometry(groundProfile, 48, 0, Math.PI * 2);
        const lavaGround = new THREE.Mesh(latheGeo, lavaGroundMaterial);
        lavaGround.position.y = -0.1;
        lavaGround.receiveShadow = true;
        group.add(lavaGround);

        // Glowing lava pools
        const lavaMaterial = new THREE.MeshStandardMaterial({
            color: 0xff4400,
            roughness: 0.3,
            metalness: 0.0,
            emissive: 0xff2200,
            emissiveIntensity: 2,
        });

        function createLavaPool(x, z, radius) {
            const poolGeo = new THREE.CylinderGeometry(radius, radius * 0.8, 0.1, 16);
            const pool = new THREE.Mesh(poolGeo, lavaMaterial);
            pool.position.set(x, 0.05, z);
            return pool;
        }

        group.add(createLavaPool(-2, -1.2, 0.5));
        group.add(createLavaPool(2.2, -0.8, 0.4));
        group.add(createLavaPool(0, -2.5, 0.7));

        // Volcanic rocks
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a0a0a,
            roughness: 1.0,
            metalness: 0.0,
        });

        function createRock(x, z, scale) {
            const rockGeo = new THREE.IcosahedronGeometry(0.4, 0);
            const positions = rockGeo.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += (Math.random() - 0.5) * 0.15;
                positions[i + 1] += (Math.random() - 0.5) * 0.15;
                positions[i + 2] += (Math.random() - 0.5) * 0.15;
            }
            rockGeo.computeVertexNormals();

            const rock = new THREE.Mesh(rockGeo, rockMaterial);
            rock.position.set(x, 0.2, z);
            rock.scale.set(scale, scale * 0.7, scale);
            rock.rotation.y = Math.random() * Math.PI;
            rock.castShadow = true;
            return rock;
        }

        group.add(createRock(-2.5, -0.5, 1.2));
        group.add(createRock(-2.0, 0.3, 0.8));
        group.add(createRock(2.4, -0.3, 1.0));
        group.add(createRock(2.0, 0.5, 0.6));
        group.add(createRock(0, -1.8, 0.5));

        // Embers/particles floating up
        const emberMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.8,
        });

        const embers = [];
        for (let i = 0; i < 50; i++) {
            const emberGeo = new THREE.SphereGeometry(0.02 + Math.random() * 0.03, 4, 4);
            const ember = new THREE.Mesh(emberGeo, emberMaterial.clone());
            ember.material.opacity = 0.5 + Math.random() * 0.5;
            ember.position.set(
                (Math.random() - 0.5) * 6,
                Math.random() * 5,
                (Math.random() - 0.5) * 6
            );
            ember.userData.speed = 0.5 + Math.random() * 1;
            ember.userData.drift = (Math.random() - 0.5) * 0.5;
            embers.push(ember);
            group.add(ember);
        }

        return { embers, lavaMaterial };
    },

    animate(state, time, deltaTime, group) {
        // Animate embers floating up
        state.embers.forEach(ember => {
            ember.position.y += ember.userData.speed * 0.01;
            ember.position.x += Math.sin(time * 2 + ember.userData.drift * 10) * 0.002;

            // Reset when too high
            if (ember.position.y > 6) {
                ember.position.y = 0;
                ember.position.x = (Math.random() - 0.5) * 6;
                ember.position.z = (Math.random() - 0.5) * 6;
            }
        });

        // Pulse lava glow
        const pulse = Math.sin(time * 2) * 0.5 + 1.5;
        state.lavaMaterial.emissiveIntensity = pulse;
    },

    interact(state, mesh, point, geoType, ctx) {
        // Break lava rocks (IcosahedronGeometry or DodecahedronGeometry)
        if (geoType === 'IcosahedronGeometry' || geoType === 'DodecahedronGeometry' ||
            geoType === 'BufferGeometry') {
            // Skip the ground plane
            if (mesh.rotation.x !== -Math.PI / 2) {
                ctx.breakRock(mesh, point);
            }
        }
    },
};
