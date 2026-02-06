import * as THREE from 'three';

export default {
    name: 'simmer',
    label: 'Simmer',

    lighting: {
        background: 0x331111,
        ambient: { color: 0xff6644, intensity: 0.3 },
        key: { color: 0xffaa88, intensity: 1.0 },
        extras: [
            { type: 'point', color: 0xff6644, intensity: 1.5, distance: 15, position: [0, 4, 0] },
        ],
    },

    create(THREE, group) {
        // Floor
        const simmerFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(12, 12),
            new THREE.MeshStandardMaterial({
                color: 0x553333,
                roughness: 0.8,
                metalness: 0.1,
            })
        );
        simmerFloor.rotation.x = -Math.PI / 2;
        simmerFloor.position.y = -0.1;
        simmerFloor.receiveShadow = true;
        group.add(simmerFloor);

        // Scattered toys/objects
        const scatteredObjects = [];
        const toyMaterial = new THREE.MeshStandardMaterial({
            color: 0xdd6644,
            roughness: 0.5,
            metalness: 0.2,
        });

        const toyShapes = [
            new THREE.BoxGeometry(0.2, 0.2, 0.2),
            new THREE.SphereGeometry(0.15, 8, 8),
            new THREE.ConeGeometry(0.12, 0.25, 6),
            new THREE.CylinderGeometry(0.1, 0.1, 0.25, 8),
            new THREE.TetrahedronGeometry(0.15),
        ];

        for (let i = 0; i < 25; i++) {
            const geo = toyShapes[i % toyShapes.length].clone();
            const obj = new THREE.Mesh(geo, toyMaterial.clone());

            obj.material.color.setHSL(Math.random() * 0.15, 0.7, 0.5);

            obj.position.set(
                (Math.random() - 0.5) * 8,
                0.15 + Math.random() * 0.1,
                (Math.random() - 0.5) * 8
            );
            obj.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            obj.userData = {
                basePos: obj.position.clone(),
                velocity: new THREE.Vector3(),
                angularVel: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                ),
                restlessness: 0.5 + Math.random() * 0.5,
                scatterTimer: Math.random() * 3,
            };

            obj.castShadow = true;
            scatteredObjects.push(obj);
            group.add(obj);
        }

        // Tipped over containers
        const containerMaterial = new THREE.MeshStandardMaterial({
            color: 0x885544,
            roughness: 0.7,
            metalness: 0.1,
        });

        for (let i = 0; i < 3; i++) {
            const container = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.35, 0.5, 12, 1, true),
                containerMaterial
            );
            const angle = (i / 3) * Math.PI * 2 + 0.5;
            container.position.set(
                Math.cos(angle) * 3,
                0.15,
                Math.sin(angle) * 3
            );
            container.rotation.z = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
            container.rotation.y = Math.random() * Math.PI;
            group.add(container);
        }

        // Heat waves / frustration pulses
        const heatWaves = [];
        const heatMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4422,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
        });

        for (let i = 0; i < 5; i++) {
            const wave = new THREE.Mesh(
                new THREE.RingGeometry(0.5, 0.7, 32),
                heatMaterial.clone()
            );
            wave.rotation.x = -Math.PI / 2;
            wave.position.y = 0.05;
            wave.visible = false;
            wave.userData = { scale: 1, life: 0 };
            heatWaves.push(wave);
            group.add(wave);
        }

        // Pressure indicator
        const pressureCore = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.5, 2),
            new THREE.MeshStandardMaterial({
                color: 0xff3300,
                roughness: 0.3,
                metalness: 0.5,
                emissive: 0xff2200,
                emissiveIntensity: 0.5,
            })
        );
        pressureCore.position.set(0, 2, 0);
        group.add(pressureCore);

        // Steam/frustration particles
        const steamParticles = [];
        const steamMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6644,
            transparent: true,
            opacity: 0.4,
        });

        for (let i = 0; i < 30; i++) {
            const steam = new THREE.Mesh(
                new THREE.SphereGeometry(0.05, 4, 4),
                steamMaterial.clone()
            );
            steam.position.set(
                (Math.random() - 0.5) * 0.5,
                2 + Math.random(),
                (Math.random() - 0.5) * 0.5
            );
            steam.userData = {
                speed: 0.5 + Math.random() * 0.5,
                drift: (Math.random() - 0.5) * 0.3,
                noInteract: true,
            };
            steam.visible = false;
            steamParticles.push(steam);
            group.add(steam);
        }

        return { scatteredObjects, heatWaves, pressureCore, steamParticles };
    },

    animate(state, time, deltaTime, group) {
        // Scattered objects - restless, won't stay put
        state.scatteredObjects.forEach(obj => {
            const o = obj.userData;

            o.scatterTimer -= deltaTime;
            if (o.scatterTimer <= 0) {
                o.velocity.x += (Math.random() - 0.5) * o.restlessness * 0.5;
                o.velocity.z += (Math.random() - 0.5) * o.restlessness * 0.5;
                o.velocity.y += Math.random() * 0.2;
                o.angularVel.x += (Math.random() - 0.5) * 3;
                o.angularVel.y += (Math.random() - 0.5) * 3;
                o.scatterTimer = 1 + Math.random() * 4;
            }

            obj.position.add(o.velocity.clone().multiplyScalar(deltaTime * 2));

            if (obj.position.y > 0.15) {
                o.velocity.y -= 2 * deltaTime;
            } else {
                obj.position.y = 0.15;
                o.velocity.y = 0;
                o.velocity.x *= 0.95;
                o.velocity.z *= 0.95;
            }

            if (Math.abs(obj.position.x) > 4) {
                o.velocity.x *= -0.7;
                obj.position.x = Math.sign(obj.position.x) * 4;
            }
            if (Math.abs(obj.position.z) > 4) {
                o.velocity.z *= -0.7;
                obj.position.z = Math.sign(obj.position.z) * 4;
            }

            obj.rotation.x += o.angularVel.x * deltaTime;
            obj.rotation.y += o.angularVel.y * deltaTime;
            obj.rotation.z += o.angularVel.z * deltaTime;

            o.angularVel.multiplyScalar(0.99);
        });

        // Heat waves - pulses of frustration
        state.heatWaves.forEach(wave => {
            if (!wave.visible && Math.random() < 0.02) {
                wave.visible = true;
                wave.position.x = (Math.random() - 0.5) * 4;
                wave.position.z = (Math.random() - 0.5) * 4;
                wave.userData.scale = 0.5;
                wave.userData.life = 1;
                wave.scale.set(0.5, 0.5, 0.5);
            }

            if (wave.visible) {
                wave.userData.scale += deltaTime * 3;
                wave.userData.life -= deltaTime * 1.5;
                wave.scale.set(wave.userData.scale, wave.userData.scale, 1);
                wave.material.opacity = wave.userData.life * 0.2;

                if (wave.userData.life <= 0) {
                    wave.visible = false;
                }
            }
        });

        // Pressure core - pulsing, building
        const pressure = Math.sin(time * 4) * 0.2 + 1;
        state.pressureCore.scale.set(pressure, pressure, pressure);
        state.pressureCore.material.emissiveIntensity = 0.3 + Math.sin(time * 6) * 0.3;
        state.pressureCore.rotation.y += deltaTime * 2;
        state.pressureCore.rotation.x = Math.sin(time * 3) * 0.2;

        // Steam particles - rising frustration
        state.steamParticles.forEach(steam => {
            if (!steam.visible && Math.random() < 0.1) {
                steam.visible = true;
                steam.position.set(
                    (Math.random() - 0.5) * 0.8,
                    2.3,
                    (Math.random() - 0.5) * 0.8
                );
                steam.material.opacity = 0.5;
            }

            if (steam.visible) {
                steam.position.y += steam.userData.speed * deltaTime;
                steam.position.x += steam.userData.drift * deltaTime;
                steam.material.opacity -= deltaTime * 0.3;

                if (steam.position.y > 5 || steam.material.opacity <= 0) {
                    steam.visible = false;
                }
            }
        });

        // Light flickers with anger
        if (state._extraLights && state._extraLights[0]) {
            state._extraLights[0].intensity = 1.5 + Math.sin(time * 8) * 0.3;
        }
    },

    interact(state, mesh, point, geoType, ctx) {
        // Kick toys around
        if (mesh.userData && (mesh.userData.restlessness !== undefined ||
            mesh.userData.velocity !== undefined)) {
            ctx.kickObject(mesh, point);
        }
        // Also kick containers
        else if (geoType === 'CylinderGeometry') {
            ctx.kickObject(mesh, point);
        }
    },
};
