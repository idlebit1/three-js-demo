import * as THREE from 'three';

export default {
    name: 'bamboo',
    label: 'Calm Bamboo',
    grandNature: true,

    lighting: {
        background: 0x87ceeb,
        ambient: { color: 0xffffff, intensity: 0.4 },
        key: { color: 0xfff5e6, intensity: 1.5 },
        extras: [],
    },

    create(THREE, group) {
        // Ground
        const groundProfile = [
            new THREE.Vector2(0, -0.3),
            new THREE.Vector2(2.8, -0.25),
            new THREE.Vector2(3.0, -0.1),
            new THREE.Vector2(3.1, 0),
            new THREE.Vector2(3.0, 0.1),
            new THREE.Vector2(2.5, 0.15),
            new THREE.Vector2(0, 0.18),
        ];

        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x7ec850,
            roughness: 0.9,
            metalness: 0.0,
        });

        // Create smooth mesh inline (LatheGeometry with merged vertices)
        const latheGeo = new THREE.LatheGeometry(groundProfile, 48, 0, Math.PI * 2);
        const ground = new THREE.Mesh(latheGeo, groundMaterial);
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        group.add(ground);

        // Bamboo stalks
        function createBamboo(x, z, height) {
            const bambooGroup = new THREE.Group();
            const segments = Math.floor(height / 0.6);

            const stalkMaterial = new THREE.MeshStandardMaterial({
                color: 0x4a7c23,
                roughness: 0.6,
                metalness: 0.1,
            });

            const stalkProfile = [];
            for (let i = 0; i <= segments; i++) {
                const y = i * 0.6;
                const r = 0.06 + Math.sin(i * Math.PI / segments) * 0.01;
                stalkProfile.push(new THREE.Vector2(r, y));

                if (i < segments) {
                    stalkProfile.push(new THREE.Vector2(r + 0.015, y + 0.55));
                    stalkProfile.push(new THREE.Vector2(r + 0.02, y + 0.58));
                    stalkProfile.push(new THREE.Vector2(r + 0.015, y + 0.6));
                }
            }

            const stalkGeometry = new THREE.LatheGeometry(stalkProfile, 12);
            const stalk = new THREE.Mesh(stalkGeometry, stalkMaterial);
            stalk.castShadow = true;
            bambooGroup.add(stalk);

            const leafMaterial = new THREE.MeshStandardMaterial({
                color: 0x5a9c2e,
                roughness: 0.8,
                side: THREE.DoubleSide,
            });

            for (let i = 0; i < 4; i++) {
                const leafGeometry = new THREE.BufferGeometry();
                const leafVerts = [
                    0, 0, 0,
                    0.05, 0.2, 0.02,
                    0.02, 0.4, 0,
                    -0.02, 0.4, 0,
                    -0.05, 0.2, -0.02,
                ];
                const leafIndices = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1];
                leafGeometry.setAttribute('position', new THREE.Float32BufferAttribute(leafVerts, 3));
                leafGeometry.setIndex(leafIndices);
                leafGeometry.computeVertexNormals();

                const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
                leaf.position.y = height - 0.2 + i * 0.15;
                leaf.rotation.y = (i / 4) * Math.PI * 2 + Math.random() * 0.5;
                leaf.rotation.z = 0.3 + Math.random() * 0.3;
                leaf.scale.set(1 + Math.random() * 0.5, 1 + Math.random() * 0.3, 1);
                bambooGroup.add(leaf);
            }

            bambooGroup.position.set(x, 0, z);
            return bambooGroup;
        }

        group.add(createBamboo(-2.5, -1, 4));
        group.add(createBamboo(-2.2, -1.5, 4.5));
        group.add(createBamboo(-2.7, -0.5, 3));
        group.add(createBamboo(2.5, -0.8, 3.8));
        group.add(createBamboo(2.3, -1.3, 3.2));
        group.add(createBamboo(2.6, -0.3, 4.2));

        return {};
    },

    animate(state, time, deltaTime, group) {
        // Static world - no animations needed
    },

    interact(state, mesh, point, geoType, ctx) {
        // Bamboo stalk = LatheGeometry
        if (geoType === 'LatheGeometry') {
            ctx.chopBambooLathe(mesh, point);
        }
        // Leaves = small PlaneGeometry not on ground
        else if (geoType === 'PlaneGeometry' && Math.abs(mesh.rotation.x) < 0.5) {
            ctx.kickObject(mesh, point);
        }
    },
};
