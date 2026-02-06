import * as THREE from 'three';

export default {
    name: 'abyss',
    label: 'The Abyss',

    lighting: {
        background: 0x020810,
        ambient: { color: 0x003344, intensity: 0.1 },
        key: { color: 0x004466, intensity: 0.3 },
        extras: [
            { type: 'point', color: 0x004466, intensity: 0.5, distance: 20, position: [0, 3, 0] },
        ],
    },

    create(THREE, group) {
        // Sandy ocean floor
        const oceanFloorMat = new THREE.MeshStandardMaterial({
            color: 0x1a2a3a,
            roughness: 0.95,
            metalness: 0.1,
        });
        const oceanFloor = new THREE.Mesh(
            new THREE.CircleGeometry(10, 48),
            oceanFloorMat
        );
        oceanFloor.rotation.x = -Math.PI / 2;
        oceanFloor.position.y = -0.1;
        oceanFloor.receiveShadow = true;
        group.add(oceanFloor);

        // Bioluminescent particles
        const bioParticles = [];
        const bioColors = [0x00ffff, 0x00ff88, 0xff00ff, 0x88ffff, 0xffff00, 0xff8800];

        for (let i = 0; i < 80; i++) {
            const size = 0.02 + Math.random() * 0.04;
            const bioMat = new THREE.MeshBasicMaterial({
                color: bioColors[Math.floor(Math.random() * bioColors.length)],
                transparent: true,
                opacity: 0.6 + Math.random() * 0.4,
            });
            const bio = new THREE.Mesh(
                new THREE.SphereGeometry(size, 6, 6),
                bioMat
            );

            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 8;
            bio.position.set(
                Math.cos(angle) * radius,
                0.5 + Math.random() * 5,
                Math.sin(angle) * radius
            );

            bio.userData = {
                basePos: bio.position.clone(),
                driftSpeed: 0.2 + Math.random() * 0.3,
                driftPhase: Math.random() * Math.PI * 2,
                pulseSpeed: 1 + Math.random() * 2,
                noInteract: true,
            };

            bioParticles.push(bio);
            group.add(bio);
        }

        // Jellyfish
        const jellyfish = [];

        function createJellyfish(x, y, z, size, color) {
            const jellyGroup = new THREE.Group();

            const bellGeo = new THREE.SphereGeometry(size, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
            const bellMat = new THREE.MeshStandardMaterial({
                color: color,
                transparent: true,
                opacity: 0.6,
                emissive: color,
                emissiveIntensity: 0.5,
                side: THREE.DoubleSide,
            });
            const bell = new THREE.Mesh(bellGeo, bellMat);
            bell.rotation.x = Math.PI;
            jellyGroup.add(bell);

            const innerGlowGeo = new THREE.SphereGeometry(size * 0.6, 12, 8);
            const innerGlowMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8,
            });
            const innerGlow = new THREE.Mesh(innerGlowGeo, innerGlowMat);
            innerGlow.position.y = size * 0.2;
            jellyGroup.add(innerGlow);

            const tentacleCount = 8 + Math.floor(Math.random() * 6);
            const tentacles = [];
            for (let i = 0; i < tentacleCount; i++) {
                const tentLen = size * (2 + Math.random() * 2);
                const tentGeo = new THREE.CylinderGeometry(0.01, 0.005, tentLen, 4);
                const tentMat = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.4,
                });
                const tentacle = new THREE.Mesh(tentGeo, tentMat);

                const angle = (i / tentacleCount) * Math.PI * 2;
                const tentRadius = size * 0.7;
                tentacle.position.set(
                    Math.cos(angle) * tentRadius,
                    -tentLen / 2,
                    Math.sin(angle) * tentRadius
                );

                tentacle.userData = {
                    baseAngle: angle,
                    length: tentLen,
                    swayPhase: Math.random() * Math.PI * 2,
                };

                tentacles.push(tentacle);
                jellyGroup.add(tentacle);
            }

            jellyGroup.position.set(x, y, z);
            jellyGroup.userData = {
                bell: bell,
                tentacles: tentacles,
                baseY: y,
                bobSpeed: 0.3 + Math.random() * 0.2,
                bobPhase: Math.random() * Math.PI * 2,
                bobAmount: 0.3 + Math.random() * 0.3,
                driftSpeed: 0.1 + Math.random() * 0.1,
                driftAngle: Math.random() * Math.PI * 2,
                pulsePhase: Math.random() * Math.PI * 2,
            };

            return jellyGroup;
        }

        const jellyColors = [0x00ffff, 0xff00ff, 0x00ff88, 0xffaa00, 0x8888ff];
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
            const radius = 2 + Math.random() * 4;
            const jelly = createJellyfish(
                Math.cos(angle) * radius,
                1.5 + Math.random() * 3,
                Math.sin(angle) * radius,
                0.2 + Math.random() * 0.2,
                jellyColors[Math.floor(Math.random() * jellyColors.length)]
            );
            jellyfish.push(jelly);
            group.add(jelly);
        }

        // Coral formations
        function createCoral(x, z, height, color) {
            const coralGroup = new THREE.Group();

            const branchCount = 3 + Math.floor(Math.random() * 4);
            for (let i = 0; i < branchCount; i++) {
                const branchHeight = height * (0.5 + Math.random() * 0.5);
                const branchGeo = new THREE.CylinderGeometry(
                    0.02 + Math.random() * 0.03,
                    0.05 + Math.random() * 0.05,
                    branchHeight,
                    6
                );
                const branchMat = new THREE.MeshStandardMaterial({
                    color: color,
                    roughness: 0.8,
                    emissive: color,
                    emissiveIntensity: 0.2,
                });
                const branch = new THREE.Mesh(branchGeo, branchMat);

                const angle = (i / branchCount) * Math.PI * 2 + Math.random() * 0.5;
                const radius = Math.random() * 0.15;
                branch.position.set(
                    Math.cos(angle) * radius,
                    branchHeight / 2,
                    Math.sin(angle) * radius
                );
                branch.rotation.x = (Math.random() - 0.5) * 0.4;
                branch.rotation.z = (Math.random() - 0.5) * 0.4;

                coralGroup.add(branch);

                for (let j = 0; j < 2 + Math.floor(Math.random() * 3); j++) {
                    const subHeight = branchHeight * (0.3 + Math.random() * 0.3);
                    const subGeo = new THREE.CylinderGeometry(0.01, 0.025, subHeight, 5);
                    const sub = new THREE.Mesh(subGeo, branchMat.clone());

                    sub.position.set(
                        branch.position.x + (Math.random() - 0.5) * 0.1,
                        branchHeight * (0.4 + Math.random() * 0.4),
                        branch.position.z + (Math.random() - 0.5) * 0.1
                    );
                    sub.rotation.x = (Math.random() - 0.5) * 0.8;
                    sub.rotation.z = (Math.random() - 0.5) * 0.8;

                    coralGroup.add(sub);
                }
            }

            coralGroup.position.set(x, 0, z);
            return coralGroup;
        }

        const coralColors = [0xff4466, 0xff8844, 0xffaa00, 0x44ffaa, 0x4488ff, 0xff44ff];
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 5;
            const coral = createCoral(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0.4 + Math.random() * 0.6,
                coralColors[Math.floor(Math.random() * coralColors.length)]
            );
            group.add(coral);
        }

        // Seaweed
        const seaweeds = [];
        for (let i = 0; i < 30; i++) {
            const segments = 5 + Math.floor(Math.random() * 4);
            const seaweedGroup = new THREE.Group();
            const seaweedColor = Math.random() > 0.5 ? 0x226644 : 0x224466;

            let prevY = 0;
            for (let s = 0; s < segments; s++) {
                const segHeight = 0.15 + Math.random() * 0.1;
                const segGeo = new THREE.BoxGeometry(0.04, segHeight, 0.01);
                const segMat = new THREE.MeshStandardMaterial({
                    color: seaweedColor,
                    roughness: 0.7,
                    side: THREE.DoubleSide,
                });
                const seg = new THREE.Mesh(segGeo, segMat);
                seg.position.y = prevY + segHeight / 2;
                seg.userData.segmentIndex = s;
                prevY += segHeight;
                seaweedGroup.add(seg);
            }

            const angle = Math.random() * Math.PI * 2;
            const radius = 1 + Math.random() * 6;
            seaweedGroup.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            seaweedGroup.userData = {
                swayPhase: Math.random() * Math.PI * 2,
                swaySpeed: 0.5 + Math.random() * 0.5,
            };

            seaweeds.push(seaweedGroup);
            group.add(seaweedGroup);
        }

        // Rising bubbles
        const bubbles = [];
        for (let i = 0; i < 40; i++) {
            const size = 0.03 + Math.random() * 0.05;
            const bubbleMat = new THREE.MeshBasicMaterial({
                color: 0xaaddff,
                transparent: true,
                opacity: 0.3 + Math.random() * 0.3,
            });
            const bubble = new THREE.Mesh(
                new THREE.SphereGeometry(size, 8, 6),
                bubbleMat
            );

            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 6;
            bubble.position.set(
                Math.cos(angle) * radius,
                Math.random() * 6,
                Math.sin(angle) * radius
            );

            bubble.userData = {
                baseX: bubble.position.x,
                baseZ: bubble.position.z,
                riseSpeed: 0.3 + Math.random() * 0.4,
                wobbleSpeed: 2 + Math.random() * 2,
                wobbleAmount: 0.05 + Math.random() * 0.1,
                wobblePhase: Math.random() * Math.PI * 2,
                noInteract: true,
            };

            bubbles.push(bubble);
            group.add(bubble);
        }

        // Mysterious giant eye
        const giantEye = new THREE.Group();
        const eyeWhiteGeo = new THREE.SphereGeometry(2, 32, 24);
        const eyeWhiteMat = new THREE.MeshBasicMaterial({
            color: 0x112233,
            transparent: true,
            opacity: 0.3,
        });
        const eyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
        giantEye.add(eyeWhite);

        const irisMat = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.8,
        });
        const iris = new THREE.Mesh(new THREE.CircleGeometry(0.8, 32), irisMat);
        iris.position.z = 1.9;
        giantEye.add(iris);

        const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.4, 24), pupilMat);
        pupil.position.z = 1.95;
        giantEye.add(pupil);

        giantEye.position.set(0, 3, -15);
        giantEye.userData = { iris: iris, pupil: pupil };
        group.add(giantEye);

        return { bioParticles, jellyfish, seaweeds, bubbles, giantEye };
    },

    animate(state, time, deltaTime, group) {
        // Bioluminescent particles
        state.bioParticles.forEach(bio => {
            if (!bio.userData || !bio.userData.basePos) return;
            const b = bio.userData;
            bio.position.x = b.basePos.x + Math.sin(time * b.driftSpeed + b.driftPhase) * 0.3;
            bio.position.y = b.basePos.y + Math.sin(time * b.driftSpeed * 0.7 + b.driftPhase) * 0.2;
            bio.position.z = b.basePos.z + Math.cos(time * b.driftSpeed * 0.8 + b.driftPhase) * 0.3;
            if (bio.material) bio.material.opacity = 0.4 + Math.sin(time * b.pulseSpeed) * 0.4;
        });

        // Jellyfish
        state.jellyfish.forEach(jelly => {
            if (!jelly.userData) return;
            const j = jelly.userData;

            jelly.position.y = j.baseY + Math.sin(time * j.bobSpeed + j.bobPhase) * j.bobAmount;

            jelly.position.x += Math.sin(j.driftAngle) * j.driftSpeed * deltaTime;
            jelly.position.z += Math.cos(j.driftAngle) * j.driftSpeed * deltaTime;

            const dist = Math.sqrt(jelly.position.x * jelly.position.x + jelly.position.z * jelly.position.z);
            if (dist > 6) {
                j.driftAngle += Math.PI;
            }

            if (j.bell) {
                const pulse = Math.sin(time * 2 + j.pulsePhase);
                j.bell.scale.x = 1 + pulse * 0.1;
                j.bell.scale.z = 1 + pulse * 0.1;
                j.bell.scale.y = 1 - pulse * 0.15;
            }

            if (j.tentacles) {
                j.tentacles.forEach(tent => {
                    if (!tent.userData) return;
                    const t = tent.userData;
                    tent.rotation.x = Math.sin(time * 1.5 + t.swayPhase) * 0.3;
                    tent.rotation.z = Math.cos(time * 1.2 + t.swayPhase) * 0.2;
                });
            }
        });

        // Seaweed swaying
        state.seaweeds.forEach(seaweed => {
            if (!seaweed.userData) return;
            const s = seaweed.userData;
            seaweed.children.forEach(seg => {
                const idx = (seg.userData && seg.userData.segmentIndex) || 0;
                const swayAmount = (idx + 1) * 0.08;
                seg.rotation.z = Math.sin(time * s.swaySpeed + s.swayPhase + idx * 0.3) * swayAmount;
            });
        });

        // Bubbles rising
        state.bubbles.forEach(bubble => {
            if (!bubble.userData) return;
            const b = bubble.userData;
            bubble.position.y += b.riseSpeed * deltaTime;
            bubble.position.x = b.baseX + Math.sin(time * b.wobbleSpeed + b.wobblePhase) * b.wobbleAmount;
            bubble.position.z = b.baseZ + Math.cos(time * b.wobbleSpeed * 0.8 + b.wobblePhase) * b.wobbleAmount;

            if (bubble.position.y > 7) {
                bubble.position.y = 0;
                b.baseX = (Math.random() - 0.5) * 12;
                b.baseZ = (Math.random() - 0.5) * 12;
                bubble.position.x = b.baseX;
                bubble.position.z = b.baseZ;
            }
        });

        // Giant eye - slowly tracking toward center (character position)
        const eye = state.giantEye;
        const targetX = 0, targetY = 1.8, targetZ = 0;

        const dx = targetX - eye.position.x;
        const dy = targetY - eye.position.y;
        const dz = targetZ - eye.position.z;

        const targetRotY = Math.atan2(dx, dz);
        eye.rotation.y += (targetRotY - eye.rotation.y) * 0.02;

        if (eye.userData && eye.userData.iris && eye.userData.pupil) {
            const lookX = Math.max(-0.5, Math.min(0.5, dx * 0.1));
            const lookY = Math.max(-0.3, Math.min(0.3, dy * 0.1));
            eye.userData.iris.position.x = lookX;
            eye.userData.iris.position.y = lookY;
            eye.userData.pupil.position.x = lookX;
            eye.userData.pupil.position.y = lookY;

            const blinkCycle = Math.sin(time * 0.3);
            if (blinkCycle > 0.98) {
                eye.userData.iris.scale.y = 0.1;
                eye.userData.pupil.scale.y = 0.1;
            } else {
                eye.userData.iris.scale.y = 1;
                eye.userData.pupil.scale.y = 1;
            }
        }
    },

    interact(state, mesh, point, geoType, ctx) {
        // Jellyfish - touch to make them glow brighter
        if (mesh.parent && mesh.parent.userData && mesh.parent.userData.tentacles) {
            ctx.glowJellyfish(mesh.parent);
        }
        // Coral formations - break them
        else if (geoType === 'CylinderGeometry' && mesh.position.y > 0 && mesh.position.y < 1) {
            ctx.breakCoral(mesh, point);
        }
        // Seaweed - swoosh it
        else if (mesh.parent && mesh.parent.userData && mesh.parent.userData.swayPhase !== undefined) {
            ctx.swooshSeaweed(mesh.parent);
        }
    },
};
