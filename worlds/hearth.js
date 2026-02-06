import * as THREE from 'three';

export default {
    name: 'hearth',
    label: 'Hearth',

    lighting: {
        background: 0x2a1810,
        ambient: { color: 0xffddbb, intensity: 0.3 },
        key: { color: 0xffcc99, intensity: 0.6 },
        extras: [
            { type: 'point', color: 0xffaa55, intensity: 1.5, distance: 10, position: [0, 1, 0] },
        ],
    },

    create(THREE, group) {
        // Soft, warm floor - like a thick rug
        const rugMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b6b4a,
            roughness: 1.0,
            metalness: 0.0,
        });
        const rug = new THREE.Mesh(
            new THREE.CircleGeometry(5, 32),
            rugMaterial
        );
        rug.rotation.x = -Math.PI / 2;
        rug.position.y = -0.1;
        rug.receiveShadow = true;
        group.add(rug);

        // Warm glowing orbs
        const glowOrbs = [];
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa66,
            transparent: true,
            opacity: 0.6,
        });

        for (let i = 0; i < 8; i++) {
            const size = 0.1 + Math.random() * 0.15;
            const orb = new THREE.Mesh(
                new THREE.SphereGeometry(size, 16, 16),
                glowMaterial.clone()
            );

            const angle = (i / 8) * Math.PI * 2;
            const radius = 3 + Math.random() * 1.5;
            orb.position.set(
                Math.cos(angle) * radius,
                1 + Math.random() * 2,
                Math.sin(angle) * radius
            );

            orb.userData = {
                baseOpacity: 0.4 + Math.random() * 0.3,
                pulseSpeed: 0.3 + Math.random() * 0.2,
                pulsePhase: Math.random() * Math.PI * 2,
            };

            glowOrbs.push(orb);
            group.add(orb);
        }

        // Family cluster
        const familyGroup = new THREE.Group();
        const familyMaterial = new THREE.MeshStandardMaterial({
            color: 0xeeddcc,
            roughness: 0.9,
            metalness: 0.0,
        });

        const parent1Geo = new THREE.SphereGeometry(0.4, 16, 16);
        const parent1 = new THREE.Mesh(parent1Geo, familyMaterial.clone());
        parent1.material.color.setHex(0xddccbb);
        parent1.position.set(-0.3, 0.4, 0);
        parent1.scale.set(1, 0.9, 0.9);
        familyGroup.add(parent1);

        const parent2 = new THREE.Mesh(parent1Geo.clone(), familyMaterial.clone());
        parent2.material.color.setHex(0xeeddcc);
        parent2.position.set(0.35, 0.38, 0.1);
        parent2.scale.set(0.95, 0.85, 0.85);
        familyGroup.add(parent2);

        const kidGeo = new THREE.SphereGeometry(0.25, 16, 16);

        const kid1 = new THREE.Mesh(kidGeo, familyMaterial.clone());
        kid1.material.color.setHex(0xffeeee);
        kid1.position.set(0, 0.25, 0.4);
        kid1.scale.set(1, 0.9, 0.9);
        familyGroup.add(kid1);

        const kid2 = new THREE.Mesh(kidGeo.clone(), familyMaterial.clone());
        kid2.material.color.setHex(0xeeffee);
        kid2.position.set(-0.25, 0.22, 0.35);
        kid2.scale.set(0.85, 0.8, 0.8);
        familyGroup.add(kid2);

        familyGroup.position.set(2.5, 0, -1);
        group.add(familyGroup);

        // Soft floating cushion shapes
        const cushions = [];
        const cushionMaterial = new THREE.MeshStandardMaterial({
            color: 0xcc9977,
            roughness: 0.95,
            metalness: 0.0,
        });

        for (let i = 0; i < 5; i++) {
            const cushionGeo = new THREE.SphereGeometry(0.3 + Math.random() * 0.2, 12, 12);
            const positions = cushionGeo.attributes.position.array;
            for (let j = 0; j < positions.length; j += 3) {
                positions[j + 1] *= 0.4;
            }
            cushionGeo.computeVertexNormals();

            const cushion = new THREE.Mesh(cushionGeo, cushionMaterial.clone());
            cushion.material.color.setHSL(0.08 + Math.random() * 0.06, 0.3 + Math.random() * 0.2, 0.5 + Math.random() * 0.15);

            const angle = Math.random() * Math.PI * 2;
            const radius = 1.5 + Math.random() * 2;
            cushion.position.set(
                Math.cos(angle) * radius,
                0.1,
                Math.sin(angle) * radius
            );
            cushion.rotation.y = Math.random() * Math.PI;

            cushions.push(cushion);
            group.add(cushion);
        }

        // Warm particles
        const hearthMotes = [];
        const hearthMoteMaterial = new THREE.MeshBasicMaterial({
            color: 0xffddaa,
            transparent: true,
            opacity: 0.3,
        });

        for (let i = 0; i < 60; i++) {
            const mote = new THREE.Mesh(
                new THREE.SphereGeometry(0.015 + Math.random() * 0.01, 4, 4),
                hearthMoteMaterial.clone()
            );
            mote.material.opacity = 0.15 + Math.random() * 0.2;

            mote.position.set(
                (Math.random() - 0.5) * 6,
                0.5 + Math.random() * 3,
                (Math.random() - 0.5) * 6
            );

            mote.userData = {
                baseY: mote.position.y,
                floatSpeed: 0.15 + Math.random() * 0.1,
                floatPhase: Math.random() * Math.PI * 2,
                noInteract: true,
            };

            hearthMotes.push(mote);
            group.add(mote);
        }

        // Soft blanket-like backdrop shapes
        const blanketMaterial = new THREE.MeshStandardMaterial({
            color: 0x997766,
            roughness: 1.0,
            metalness: 0.0,
            side: THREE.DoubleSide,
        });

        for (let i = 0; i < 3; i++) {
            const blanketGeo = new THREE.PlaneGeometry(2, 1.5, 8, 8);
            const positions = blanketGeo.attributes.position.array;
            for (let j = 0; j < positions.length; j += 3) {
                positions[j + 2] = Math.sin(positions[j] * 2) * 0.1 + Math.cos(positions[j + 1] * 2) * 0.08;
            }
            blanketGeo.computeVertexNormals();

            const blanket = new THREE.Mesh(blanketGeo, blanketMaterial.clone());
            blanket.material.color.setHSL(0.06 + Math.random() * 0.04, 0.25, 0.4 + Math.random() * 0.1);

            const angle = (i / 3) * Math.PI * 2 + 0.5;
            blanket.position.set(
                Math.cos(angle) * 4,
                0.8 + Math.random() * 0.5,
                Math.sin(angle) * 4
            );
            blanket.rotation.y = angle + Math.PI;
            blanket.rotation.x = -0.2;

            group.add(blanket);
        }

        return { glowOrbs, familyGroup, kid1, kid2, cushions, hearthMotes };
    },

    animate(state, time, deltaTime, group) {
        // Glowing orbs - gentle pulse like candlelight
        state.glowOrbs.forEach(orb => {
            const o = orb.userData;
            const pulse = Math.sin(time * o.pulseSpeed + o.pulsePhase) * 0.15 + 0.85;
            orb.material.opacity = o.baseOpacity * pulse;
            orb.scale.setScalar(1 + (pulse - 0.85) * 0.3);
        });

        // Family cluster - gentle breathing together
        const breathe = Math.sin(time * 0.8) * 0.02;
        state.familyGroup.position.y = breathe;
        state.familyGroup.rotation.y = Math.sin(time * 0.2) * 0.03;

        // Kids snuggle closer occasionally
        state.kid1.position.z = 0.4 + Math.sin(time * 0.5) * 0.03;
        state.kid2.position.x = -0.25 + Math.sin(time * 0.4) * 0.02;

        // Motes - very slow, peaceful drift
        state.hearthMotes.forEach(mote => {
            const m = mote.userData;
            mote.position.y = m.baseY + Math.sin(time * m.floatSpeed + m.floatPhase) * 0.2;
        });

        // Central glow - warm fireplace flicker
        if (state._extraLights && state._extraLights[0]) {
            const flicker = Math.sin(time * 3) * 0.1 + Math.sin(time * 7) * 0.05 + 1;
            state._extraLights[0].intensity = 1.3 * flicker;
        }
    },

    interact(state, mesh, point, geoType, ctx) {
        // Squish cushions and soft things (spheres not on ground)
        if (geoType === 'SphereGeometry' && mesh.position.y > 0) {
            ctx.squishObject(mesh, point);
        }
    },
};
