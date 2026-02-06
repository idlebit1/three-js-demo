import * as THREE from 'three';

export default {
    name: 'euphoria',
    label: 'Euphoria',

    lighting: {
        background: 0xffd700,
        ambient: { color: 0xffffee, intensity: 0.7 },
        key: { color: 0xffffff, intensity: 1.5 },
        extras: [],
    },

    create(THREE, group) {
        // Rainbow ground
        const rainbowGroundMat = new THREE.MeshStandardMaterial({
            color: 0xffaacc,
            roughness: 0.6,
            metalness: 0.2,
        });
        const rainbowGround = new THREE.Mesh(
            new THREE.CircleGeometry(10, 48),
            rainbowGroundMat
        );
        rainbowGround.rotation.x = -Math.PI / 2;
        rainbowGround.position.y = -0.1;
        rainbowGround.receiveShadow = true;
        group.add(rainbowGround);

        // Confetti particles
        const confetti = [];
        const confettiColors = [0xff0066, 0x00ff66, 0x6600ff, 0xffff00, 0x00ffff, 0xff6600];
        for (let i = 0; i < 100; i++) {
            const confettiGeo = new THREE.PlaneGeometry(0.08, 0.12);
            const confettiMat = new THREE.MeshBasicMaterial({
                color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                side: THREE.DoubleSide,
            });
            const conf = new THREE.Mesh(confettiGeo, confettiMat);
            conf.position.set(
                (Math.random() - 0.5) * 14,
                Math.random() * 8,
                (Math.random() - 0.5) * 14
            );
            conf.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            conf.userData = {
                fallSpeed: 0.5 + Math.random() * 1,
                spinSpeed: 2 + Math.random() * 4,
                swayPhase: Math.random() * Math.PI * 2,
                noInteract: true,
            };
            confetti.push(conf);
            group.add(conf);
        }

        // Bouncing balloons
        const balloons = [];
        const balloonColors = [0xff3366, 0x33ff66, 0x3366ff, 0xffff33, 0xff33ff, 0x33ffff];
        for (let i = 0; i < 15; i++) {
            const balloonGroup = new THREE.Group();
            const balloonGeo = new THREE.SphereGeometry(0.3 + Math.random() * 0.2, 16, 12);
            const balloonMat = new THREE.MeshStandardMaterial({
                color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
                roughness: 0.3,
                metalness: 0.1,
            });
            const balloon = new THREE.Mesh(balloonGeo, balloonMat);
            balloonGroup.add(balloon);
            // String
            const stringGeo = new THREE.CylinderGeometry(0.005, 0.005, 1, 4);
            const stringMat = new THREE.MeshBasicMaterial({ color: 0x888888 });
            const string = new THREE.Mesh(stringGeo, stringMat);
            string.position.y = -0.65;
            balloonGroup.add(string);

            const angle = Math.random() * Math.PI * 2;
            const radius = 1 + Math.random() * 5;
            balloonGroup.position.set(
                Math.cos(angle) * radius,
                2 + Math.random() * 3,
                Math.sin(angle) * radius
            );
            balloonGroup.userData = {
                baseY: balloonGroup.position.y,
                bobSpeed: 1 + Math.random() * 0.5,
                bobPhase: Math.random() * Math.PI * 2,
            };
            balloons.push(balloonGroup);
            group.add(balloonGroup);
        }

        // Sparkle bursts
        const sparkles = [];
        for (let i = 0; i < 30; i++) {
            const sparkleGeo = new THREE.OctahedronGeometry(0.05, 0);
            const sparkleMat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.8,
            });
            const sparkle = new THREE.Mesh(sparkleGeo, sparkleMat);
            sparkle.position.set(
                (Math.random() - 0.5) * 12,
                0.5 + Math.random() * 5,
                (Math.random() - 0.5) * 12
            );
            sparkle.userData = {
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 3 + Math.random() * 3,
                noInteract: true,
            };
            sparkles.push(sparkle);
            group.add(sparkle);
        }

        // Giant smiley face in the sky
        const smileyGroup = new THREE.Group();
        const faceGeo = new THREE.CircleGeometry(1.5, 32);
        const faceMat = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
        const face = new THREE.Mesh(faceGeo, faceMat);
        smileyGroup.add(face);
        // Eyes
        const smileyEyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const smileyLeftEye = new THREE.Mesh(new THREE.CircleGeometry(0.2, 16), smileyEyeMat);
        smileyLeftEye.position.set(-0.5, 0.4, 0.01);
        smileyGroup.add(smileyLeftEye);
        const smileyRightEye = new THREE.Mesh(new THREE.CircleGeometry(0.2, 16), smileyEyeMat);
        smileyRightEye.position.set(0.5, 0.4, 0.01);
        smileyGroup.add(smileyRightEye);
        // Smile
        const smileGeo = new THREE.TorusGeometry(0.6, 0.08, 8, 16, Math.PI);
        const smile = new THREE.Mesh(smileGeo, smileyEyeMat);
        smile.position.set(0, -0.1, 0.01);
        smile.rotation.z = Math.PI;
        smileyGroup.add(smile);
        smileyGroup.position.set(0, 6, -8);
        smileyGroup.userData = { noInteract: true };
        group.add(smileyGroup);

        return { confetti, balloons, sparkles, smileyGroup };
    },

    animate(state, time, deltaTime, group) {
        // Confetti falling and spinning
        state.confetti.forEach(conf => {
            const c = conf.userData;
            conf.position.y -= c.fallSpeed * deltaTime;
            conf.position.x += Math.sin(time * 2 + c.swayPhase) * 0.01;
            conf.rotation.x += c.spinSpeed * deltaTime;
            conf.rotation.y += c.spinSpeed * 0.7 * deltaTime;

            if (conf.position.y < 0) {
                conf.position.y = 8;
                conf.position.x = (Math.random() - 0.5) * 14;
                conf.position.z = (Math.random() - 0.5) * 14;
            }
        });

        // Balloons bobbing
        state.balloons.forEach(balloon => {
            const b = balloon.userData;
            balloon.position.y = b.baseY + Math.sin(time * b.bobSpeed + b.bobPhase) * 0.3;
            balloon.rotation.z = Math.sin(time * 0.5 + b.bobPhase) * 0.1;
        });

        // Sparkles pulsing
        state.sparkles.forEach(sparkle => {
            const s = sparkle.userData;
            const pulse = Math.sin(time * s.pulseSpeed + s.pulsePhase);
            sparkle.scale.setScalar(0.5 + pulse * 0.5);
            sparkle.material.opacity = 0.4 + pulse * 0.4;
            sparkle.rotation.y += deltaTime * 2;
        });

        // Smiley face gentle pulse
        state.smileyGroup.scale.setScalar(1 + Math.sin(time) * 0.02);
    },

    interact(state, mesh, point, geoType, ctx) {
        // Pop balloons
        if (mesh.parent && mesh.parent.userData && mesh.parent.userData.bobSpeed !== undefined) {
            ctx.playSound('mushroomPop');
            const balloon = mesh.parent;
            balloon.visible = false;
            setTimeout(() => {
                balloon.visible = true;
                balloon.position.y = balloon.userData.baseY;
            }, 2000);
        }
    },
};
