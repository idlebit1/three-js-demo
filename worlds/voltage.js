import * as THREE from 'three';

export default {
    name: 'voltage',
    label: 'Voltage',

    lighting: {
        background: 0x0a0a0f,
        ambient: { color: 0x8888aa, intensity: 0.2 },
        key: { color: 0xffffff, intensity: 1.2 },
        extras: [
            { type: 'point', color: 0xffffff, intensity: 2, distance: 15, position: [0, 5, 0] },
        ],
    },

    create(THREE, group) {
        // Industrial concrete floor with grid lines
        const concreteFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(14, 14),
            new THREE.MeshStandardMaterial({
                color: 0x3a3a3a,
                roughness: 0.9,
                metalness: 0.1,
            })
        );
        concreteFloor.rotation.x = -Math.PI / 2;
        concreteFloor.position.y = -0.1;
        concreteFloor.receiveShadow = true;
        group.add(concreteFloor);

        // Grid lines on floor
        const gridMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 });
        for (let i = -6; i <= 6; i += 1) {
            const lineGeoH = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-7, 0.01, i),
                new THREE.Vector3(7, 0.01, i)
            ]);
            const lineGeoV = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(i, 0.01, -7),
                new THREE.Vector3(i, 0.01, 7)
            ]);
            group.add(new THREE.Line(lineGeoH, gridMaterial));
            group.add(new THREE.Line(lineGeoV, gridMaterial));
        }

        // Spinning geometric objects
        const spinners = [];
        const spinnerMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.3,
            metalness: 0.8,
        });

        const spinnerShapes = [
            new THREE.BoxGeometry(0.4, 0.4, 0.4),
            new THREE.OctahedronGeometry(0.3),
            new THREE.TetrahedronGeometry(0.35),
            new THREE.TorusGeometry(0.25, 0.08, 8, 16),
            new THREE.ConeGeometry(0.2, 0.5, 6),
        ];

        for (let i = 0; i < 12; i++) {
            const geo = spinnerShapes[i % spinnerShapes.length].clone();
            const spinner = new THREE.Mesh(geo, spinnerMaterial.clone());

            const hue = Math.random() < 0.3 ? 0.5 + Math.random() * 0.1 : 0;
            spinner.material.color.setHSL(hue, hue > 0 ? 0.7 : 0, 0.4 + Math.random() * 0.2);

            const angle = (i / 12) * Math.PI * 2;
            const radius = 2 + Math.random() * 2.5;
            spinner.position.set(
                Math.cos(angle) * radius,
                0.5 + Math.random() * 3,
                Math.sin(angle) * radius
            );

            spinner.userData = {
                spinSpeedX: (Math.random() - 0.5) * 8,
                spinSpeedY: (Math.random() - 0.5) * 10,
                spinSpeedZ: (Math.random() - 0.5) * 6,
                jitterAmount: 0.01 + Math.random() * 0.02,
                basePos: spinner.position.clone(),
                burstTimer: Math.random() * 5,
                burstCooldown: 2 + Math.random() * 3,
            };

            spinner.castShadow = true;
            spinners.push(spinner);
            group.add(spinner);
        }

        // Electric sparks
        const sparks = [];
        const sparkMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
        });

        for (let i = 0; i < 40; i++) {
            const spark = new THREE.Mesh(
                new THREE.SphereGeometry(0.02, 4, 4),
                sparkMaterial.clone()
            );
            spark.position.set(
                (Math.random() - 0.5) * 10,
                Math.random() * 5,
                (Math.random() - 0.5) * 10
            );
            spark.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3
                ),
                life: Math.random(),
                maxLife: 0.5 + Math.random() * 1,
                noInteract: true,
            };
            spark.visible = false;
            sparks.push(spark);
            group.add(spark);
        }

        // Lightning bolts
        const boltMaterial = new THREE.LineBasicMaterial({
            color: 0x88ffff,
            transparent: true,
            linewidth: 2,
        });
        const bolts = [];

        function createBolt() {
            const points = [];
            let y = 5;
            let x = (Math.random() - 0.5) * 6;
            let z = (Math.random() - 0.5) * 6;

            while (y > 0) {
                points.push(new THREE.Vector3(x, y, z));
                y -= 0.3 + Math.random() * 0.4;
                x += (Math.random() - 0.5) * 0.8;
                z += (Math.random() - 0.5) * 0.8;
            }

            const geo = new THREE.BufferGeometry().setFromPoints(points);
            const bolt = new THREE.Line(geo, boltMaterial.clone());
            bolt.userData = { life: 0.1 + Math.random() * 0.1 };
            bolt.visible = false;
            return bolt;
        }

        for (let i = 0; i < 5; i++) {
            const bolt = createBolt();
            bolts.push(bolt);
            group.add(bolt);
        }

        // Floating screens/displays
        const screenMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.7,
        });

        const screens = [];
        for (let i = 0; i < 4; i++) {
            const screen = new THREE.Mesh(
                new THREE.PlaneGeometry(0.6, 0.4),
                screenMaterial.clone()
            );
            const angle = (i / 4) * Math.PI * 2 + 0.3;
            screen.position.set(
                Math.cos(angle) * 3.5,
                2 + Math.random(),
                Math.sin(angle) * 3.5
            );
            screen.lookAt(0, 2, 0);
            screen.userData = {
                flickerSpeed: 10 + Math.random() * 20,
                glitchChance: 0.02,
                baseOpacity: 0.5 + Math.random() * 0.3,
                hue: Math.random(),
            };
            screens.push(screen);
            group.add(screen);
        }

        // Light fixture mesh
        const fixtureMaterial = new THREE.MeshBasicMaterial({ color: 0xffffee });
        const fixture = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.1, 0.4),
            fixtureMaterial
        );
        fixture.position.set(0, 5, 0);
        group.add(fixture);

        return { spinners, sparks, bolts, screens, fixture };
    },

    animate(state, time, deltaTime, group) {
        // Spinners - fast, uneven, jittery
        state.spinners.forEach(spinner => {
            const s = spinner.userData;

            spinner.rotation.x += s.spinSpeedX * deltaTime;
            spinner.rotation.y += s.spinSpeedY * deltaTime;
            spinner.rotation.z += s.spinSpeedZ * deltaTime;

            spinner.position.x = s.basePos.x + (Math.random() - 0.5) * s.jitterAmount;
            spinner.position.y = s.basePos.y + (Math.random() - 0.5) * s.jitterAmount;
            spinner.position.z = s.basePos.z + (Math.random() - 0.5) * s.jitterAmount;

            s.burstTimer -= deltaTime;
            if (s.burstTimer <= 0) {
                s.spinSpeedX *= 1.5 + Math.random();
                s.spinSpeedY *= 1.5 + Math.random();
                s.burstTimer = s.burstCooldown;
                setTimeout(() => {
                    s.spinSpeedX *= 0.6;
                    s.spinSpeedY *= 0.6;
                }, 200);
            }
        });

        // Sparks - erratic, snapping
        state.sparks.forEach(spark => {
            const s = spark.userData;

            if (!spark.visible && Math.random() < 0.05) {
                spark.visible = true;
                spark.position.set(
                    (Math.random() - 0.5) * 8,
                    Math.random() * 4 + 0.5,
                    (Math.random() - 0.5) * 8
                );
                s.velocity.set(
                    (Math.random() - 0.5) * 0.4,
                    (Math.random() - 0.5) * 0.4,
                    (Math.random() - 0.5) * 0.4
                );
                s.life = 0;
                spark.material.opacity = 1;
            }

            if (spark.visible) {
                s.life += deltaTime;
                spark.position.add(s.velocity);
                s.velocity.multiplyScalar(0.95);

                if (Math.random() < 0.1) {
                    s.velocity.x += (Math.random() - 0.5) * 0.2;
                    s.velocity.y += (Math.random() - 0.5) * 0.2;
                    s.velocity.z += (Math.random() - 0.5) * 0.2;
                }

                spark.material.opacity = 1 - (s.life / s.maxLife);

                if (s.life >= s.maxLife) {
                    spark.visible = false;
                }
            }
        });

        // Lightning bolts - brief flashes
        state.bolts.forEach(bolt => {
            if (!bolt.visible && Math.random() < 0.008) {
                const points = [];
                let y = 5;
                let x = (Math.random() - 0.5) * 6;
                let z = (Math.random() - 0.5) * 6;

                while (y > 0) {
                    points.push(new THREE.Vector3(x, y, z));
                    y -= 0.3 + Math.random() * 0.4;
                    x += (Math.random() - 0.5) * 0.8;
                    z += (Math.random() - 0.5) * 0.8;
                }

                bolt.geometry.setFromPoints(points);
                bolt.visible = true;
                bolt.userData.life = 0.05 + Math.random() * 0.08;
                bolt.material.opacity = 1;
            }

            if (bolt.visible) {
                bolt.userData.life -= deltaTime;
                bolt.material.opacity = bolt.userData.life * 10;
                if (bolt.userData.life <= 0) {
                    bolt.visible = false;
                }
            }
        });

        // Screens - flickering, glitching
        state.screens.forEach(screen => {
            const s = screen.userData;

            const flicker = Math.sin(time * s.flickerSpeed) * 0.2 + 0.8;
            screen.material.opacity = s.baseOpacity * flicker;

            if (Math.random() < s.glitchChance) {
                screen.material.color.setHSL(Math.random(), 0.8, 0.5);
                screen.material.opacity = 1;
            } else {
                screen.material.color.setHSL(s.hue, 0.7, 0.5);
            }

            screen.position.x += (Math.random() - 0.5) * 0.005;
        });

        // Overhead light - that humming flicker
        const hum = Math.sin(time * 120) * 0.1 + Math.sin(time * 60) * 0.05;
        if (state._extraLights && state._extraLights[0]) {
            state._extraLights[0].intensity = 2 + hum + (Math.random() < 0.02 ? -0.5 : 0);
        }
        state.fixture.material.color.setHSL(0.15, 0.1, 0.9 + hum * 0.5);
    },

    interact(state, mesh, point, geoType, ctx) {
        // Zap spinners - anything with spin userData
        if (mesh.userData && mesh.userData.spinSpeedX !== undefined) {
            ctx.zapObject(mesh, point);
        }
    },
};
