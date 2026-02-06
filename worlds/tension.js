import * as THREE from 'three';

export default {
    name: 'tension',
    label: 'Tension',

    lighting: {
        background: 0x0a0808,
        ambient: { color: 0x331111, intensity: 0.15 },
        key: { color: 0xff4422, intensity: 0.4 },
        extras: [
            { type: 'point', color: 0xff2200, intensity: 0.3, distance: 15, position: [0, 2, 0] },
        ],
    },

    create(THREE, group) {
        // Cracked ground
        const crackedGroundMat = new THREE.MeshStandardMaterial({
            color: 0x1a1515,
            roughness: 0.9,
            metalness: 0.1,
        });
        const crackedGround = new THREE.Mesh(
            new THREE.CircleGeometry(10, 48),
            crackedGroundMat
        );
        crackedGround.rotation.x = -Math.PI / 2;
        crackedGround.position.y = -0.1;
        crackedGround.receiveShadow = true;
        group.add(crackedGround);

        // Jagged spikes
        for (let i = 0; i < 20; i++) {
            const spikeHeight = 0.5 + Math.random() * 1.5;
            const spikeGeo = new THREE.ConeGeometry(0.1 + Math.random() * 0.15, spikeHeight, 5);
            const spikeMat = new THREE.MeshStandardMaterial({
                color: 0x2a1515,
                roughness: 0.8,
            });
            const spike = new THREE.Mesh(spikeGeo, spikeMat);
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 5;
            spike.position.set(Math.cos(angle) * radius, spikeHeight / 2, Math.sin(angle) * radius);
            spike.rotation.x = (Math.random() - 0.5) * 0.3;
            spike.rotation.z = (Math.random() - 0.5) * 0.3;
            group.add(spike);
        }

        // Watching eyes in the darkness
        const watchingEyes = [];
        for (let i = 0; i < 8; i++) {
            const eyeGroup = new THREE.Group();
            const eyeGeo = new THREE.SphereGeometry(0.15, 12, 8);
            const eyeMat = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.8,
            });
            const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
            eye1.position.x = -0.2;
            eyeGroup.add(eye1);
            const eye2 = new THREE.Mesh(eyeGeo, eyeMat.clone());
            eye2.position.x = 0.2;
            eyeGroup.add(eye2);

            const angle = (i / 8) * Math.PI * 2;
            eyeGroup.position.set(Math.cos(angle) * 7, 1 + Math.random() * 2, Math.sin(angle) * 7);
            eyeGroup.lookAt(0, 1, 0);
            eyeGroup.userData = {
                blinkPhase: Math.random() * Math.PI * 2,
                blinkSpeed: 0.5 + Math.random() * 0.5,
            };
            watchingEyes.push(eyeGroup);
            group.add(eyeGroup);
        }

        // Flickering light sources
        const flickerLights = [];
        for (let i = 0; i < 5; i++) {
            const lightGeo = new THREE.SphereGeometry(0.1, 8, 6);
            const lightMat = new THREE.MeshBasicMaterial({
                color: 0xff3300,
                transparent: true,
                opacity: 0.9,
            });
            const light = new THREE.Mesh(lightGeo, lightMat);
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 4;
            light.position.set(Math.cos(angle) * radius, 0.5 + Math.random() * 1, Math.sin(angle) * radius);
            light.userData = {
                flickerPhase: Math.random() * Math.PI * 2,
                flickerSpeed: 5 + Math.random() * 10,
                noInteract: true,
            };
            flickerLights.push(light);
            group.add(light);
        }

        // Shadowy tendrils
        for (let i = 0; i < 12; i++) {
            const tendrilGeo = new THREE.CylinderGeometry(0.03, 0.08, 2, 6);
            const tendrilMat = new THREE.MeshStandardMaterial({
                color: 0x0a0505,
                transparent: true,
                opacity: 0.7,
            });
            const tendril = new THREE.Mesh(tendrilGeo, tendrilMat);
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 4;
            tendril.position.set(Math.cos(angle) * radius, 1, Math.sin(angle) * radius);
            tendril.rotation.x = (Math.random() - 0.5) * 0.5;
            tendril.rotation.z = (Math.random() - 0.5) * 0.5;
            tendril.userData = {
                swayPhase: Math.random() * Math.PI * 2,
                swaySpeed: 0.5 + Math.random() * 0.5,
            };
            group.add(tendril);
        }

        return { watchingEyes, flickerLights };
    },

    animate(state, time, deltaTime, group) {
        // Watching eyes blinking and tracking
        state.watchingEyes.forEach(eyeGroup => {
            const e = eyeGroup.userData;
            const blink = Math.sin(time * e.blinkSpeed + e.blinkPhase);

            if (blink > 0.95) {
                eyeGroup.children.forEach(eye => {
                    eye.scale.y = 0.1;
                });
            } else {
                eyeGroup.children.forEach(eye => {
                    eye.scale.y = 1;
                });
            }

            eyeGroup.lookAt(0, 1, 0);

            eyeGroup.children.forEach(eye => {
                if (eye.material) {
                    eye.material.opacity = 0.5 + Math.sin(time * 2 + e.blinkPhase) * 0.3;
                }
            });
        });

        // Flickering lights
        state.flickerLights.forEach(light => {
            const f = light.userData;
            const flicker = Math.sin(time * f.flickerSpeed + f.flickerPhase);
            light.material.opacity = flicker > 0 ? 0.9 : 0.2;
            light.scale.setScalar(0.8 + flicker * 0.4);
        });

        // Tendrils swaying menacingly
        group.children.forEach(child => {
            if (child.userData && child.userData.swayPhase !== undefined && child.userData.swaySpeed) {
                child.rotation.x = Math.sin(time * child.userData.swaySpeed + child.userData.swayPhase) * 0.2;
                child.rotation.z = Math.cos(time * child.userData.swaySpeed * 0.7 + child.userData.swayPhase) * 0.15;
            }
        });

        // Tension light flickering
        if (state._extraLights && state._extraLights[0] && state._extraLights[0].visible) {
            state._extraLights[0].intensity = 0.2 + Math.random() * 0.2;
        }
    },

    interact(state, mesh, point, geoType, ctx) {
        // Kick spikes
        if (geoType === 'ConeGeometry') {
            ctx.playSound('rockBreak');
            ctx.kickObject(mesh, point);
        }
    },
};
