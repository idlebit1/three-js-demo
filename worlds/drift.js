import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

export default {
    name: 'drift',
    label: 'Amber Drift',

    lighting: {
        background: 0x4a3f35,
        ambient: { color: 0xddc4a0, intensity: 0.5 },
        key: { color: 0xffcc88, intensity: 0.8 },
        extras: [
            { type: 'directional', color: 0xffaa55, intensity: 0.8, position: [5, 4, -2] },
        ],
    },

    create(THREE, group) {
        function smoothGeometry(geometry) {
            geometry = mergeVertices(geometry);
            geometry.computeVertexNormals();
            return geometry;
        }

        // Worn wooden floor
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.85,
            metalness: 0.0,
        });

        const floorGeo = new THREE.PlaneGeometry(12, 12, 1, 1);
        const floor = new THREE.Mesh(floorGeo, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.1;
        floor.receiveShadow = true;
        group.add(floor);

        // Dust motes floating in the amber light
        const dustMotes = [];
        const dustMaterial = new THREE.MeshBasicMaterial({
            color: 0xffeebb,
            transparent: true,
            opacity: 0.4,
        });

        for (let i = 0; i < 200; i++) {
            const size = 0.008 + Math.random() * 0.015;
            const dustGeo = new THREE.SphereGeometry(size, 4, 4);
            const dust = new THREE.Mesh(dustGeo, dustMaterial.clone());
            dust.material.opacity = 0.2 + Math.random() * 0.4;

            dust.position.set(
                (Math.random() - 0.5) * 8,
                Math.random() * 6,
                (Math.random() - 0.5) * 8
            );

            dust.userData = {
                baseY: dust.position.y,
                driftSpeed: 0.1 + Math.random() * 0.2,
                driftPhase: Math.random() * Math.PI * 2,
                swayAmount: 0.3 + Math.random() * 0.5,
                swaySpeed: 0.2 + Math.random() * 0.3,
                noInteract: true,
            };

            dustMotes.push(dust);
            group.add(dust);
        }

        // Smooth, worn stones floating gently
        const floatingStones = [];
        const stoneMaterial = new THREE.MeshStandardMaterial({
            color: 0xa09080,
            roughness: 0.7,
            metalness: 0.1,
        });

        for (let i = 0; i < 8; i++) {
            const stoneSize = 0.15 + Math.random() * 0.2;
            let stoneGeo = new THREE.IcosahedronGeometry(stoneSize, 2);
            const positions = stoneGeo.attributes.position.array;
            for (let j = 0; j < positions.length; j += 3) {
                positions[j] *= 0.8 + Math.random() * 0.4;
                positions[j + 1] *= 0.7 + Math.random() * 0.3;
                positions[j + 2] *= 0.8 + Math.random() * 0.4;
            }
            stoneGeo = smoothGeometry(stoneGeo);

            const stone = new THREE.Mesh(stoneGeo, stoneMaterial.clone());
            stone.material.color.setHSL(0.08 + Math.random() * 0.05, 0.15, 0.5 + Math.random() * 0.15);

            // Create invisible hitbox sphere
            const hitboxGeo = new THREE.SphereGeometry(stoneSize * 1.8, 8, 6);
            const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
            const hitbox = new THREE.Mesh(hitboxGeo, hitboxMat);

            const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
            const radius = 2 + Math.random() * 2;
            const posY = 1 + Math.random() * 3;
            stone.position.set(Math.cos(angle) * radius, posY, Math.sin(angle) * radius);
            hitbox.position.copy(stone.position);

            hitbox.userData = {
                baseY: posY,
                floatSpeed: 0.15 + Math.random() * 0.1,
                floatPhase: Math.random() * Math.PI * 2,
                floatAmount: 0.1 + Math.random() * 0.15,
                rotateSpeed: 0.05 + Math.random() * 0.1,
                linkedStone: stone,
                isHitbox: true,
            };

            stone.userData = {
                baseY: posY,
                floatSpeed: hitbox.userData.floatSpeed,
                floatPhase: hitbox.userData.floatPhase,
                floatAmount: hitbox.userData.floatAmount,
                rotateSpeed: hitbox.userData.rotateSpeed,
                linkedHitbox: hitbox,
            };

            stone.castShadow = true;
            floatingStones.push(stone);
            floatingStones.push(hitbox);
            group.add(stone);
            group.add(hitbox);
        }

        // Light shaft
        const shaftGeo = new THREE.CylinderGeometry(0.8, 1.5, 8, 16, 1, true);
        const shaftMaterial = new THREE.MeshBasicMaterial({
            color: 0xffdd99,
            transparent: true,
            opacity: 0.06,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        const lightShaft = new THREE.Mesh(shaftGeo, shaftMaterial);
        lightShaft.position.set(2, 3, -1);
        lightShaft.rotation.z = 0.4;
        lightShaft.rotation.x = 0.2;
        lightShaft.userData.noInteract = true;
        group.add(lightShaft);

        // Second, fainter shaft
        const shaft2 = new THREE.Mesh(shaftGeo.clone(), shaftMaterial.clone());
        shaft2.material.opacity = 0.03;
        shaft2.position.set(-1.5, 3.5, 1);
        shaft2.rotation.z = -0.3;
        shaft2.rotation.x = -0.15;
        shaft2.scale.set(0.7, 1, 0.7);
        shaft2.userData.noInteract = true;
        group.add(shaft2);

        // Abstract forms - worn paper-like planes
        const thoughtMaterial = new THREE.MeshStandardMaterial({
            color: 0xc4a882,
            roughness: 0.6,
            metalness: 0.15,
            transparent: true,
            opacity: 0.7,
        });

        for (let i = 0; i < 3; i++) {
            const paperGeo = new THREE.PlaneGeometry(0.4, 0.3, 8, 8);
            const paperPositions = paperGeo.attributes.position.array;
            for (let j = 0; j < paperPositions.length; j += 3) {
                paperPositions[j + 2] = Math.sin(paperPositions[j] * 3) * 0.03 +
                                        Math.cos(paperPositions[j + 1] * 2) * 0.02;
            }
            paperGeo.computeVertexNormals();

            const paper = new THREE.Mesh(paperGeo, thoughtMaterial.clone());
            paper.material.opacity = 0.4 + Math.random() * 0.3;
            paper.material.side = THREE.DoubleSide;

            paper.position.set(
                (Math.random() - 0.5) * 4,
                1.5 + Math.random() * 2,
                (Math.random() - 0.5) * 4
            );
            paper.rotation.set(
                Math.random() * 0.5,
                Math.random() * Math.PI,
                Math.random() * 0.3
            );

            paper.userData = {
                baseY: paper.position.y,
                driftSpeed: 0.08 + Math.random() * 0.05,
                driftPhase: Math.random() * Math.PI * 2,
            };

            floatingStones.push(paper);
            group.add(paper);
        }

        return { dustMotes, floatingStones, lightShaft };
    },

    animate(state, time, deltaTime, group) {
        // Dust motes - slow, meandering drift
        state.dustMotes.forEach(dust => {
            const d = dust.userData;
            dust.position.y = d.baseY + Math.sin(time * d.driftSpeed + d.driftPhase) * 0.3;
            dust.position.x += Math.sin(time * d.swaySpeed + d.driftPhase) * 0.001 * d.swayAmount;
            dust.position.z += Math.cos(time * d.swaySpeed * 0.7 + d.driftPhase) * 0.001 * d.swayAmount;

            if (Math.abs(dust.position.x) > 5) dust.position.x *= 0.99;
            if (Math.abs(dust.position.z) > 5) dust.position.z *= 0.99;
        });

        // Floating stones - low gravity, contemplative bobbing
        state.floatingStones.forEach(stone => {
            const s = stone.userData;
            stone.position.y = s.baseY + Math.sin(time * s.floatSpeed + s.floatPhase) * s.floatAmount;
            stone.rotation.y += s.rotateSpeed * 0.005;
            stone.rotation.x += s.rotateSpeed * 0.002;
        });

        // Subtle light shaft breathing
        state.lightShaft.material.opacity = 0.04 + Math.sin(time * 0.3) * 0.02;
    },

    interact(state, mesh, point, geoType, ctx) {
        // Floating stones explode and reconstitute
        if (mesh.userData && mesh.userData.floatSpeed !== undefined) {
            const targetStone = mesh.userData.linkedStone || mesh;
            if (!targetStone.userData.isHitbox && !targetStone.userData.isExploding) {
                ctx.explodeAndReconstitute(targetStone, point);
            }
        }
        // Papers flutter away
        else if (geoType === 'PlaneGeometry' && mesh.rotation.x !== -Math.PI / 2) {
            ctx.kickObject(mesh, point);
        }
    },
};
