// Church — float world
// Atmospheric cathedral interior with light beams, stained glass, candles, organ pipes

export default {
    name: 'church',
    label: 'Cathedral',
    sphereInteractionType: 'float',

    lighting: {
        background: 0x0e0a14,
        ambient: { color: 0x997755, intensity: 0.25 },
        key: { color: 0xffcc88, intensity: 0.7 },
        extras: [],
    },

    fog: { color: 0x2a2035, density: 0.045 },
    hideCameraLights: true,

    skyColor(altitude) {
        const color = { h: 0, s: 0, l: 0 };
        if (altitude < 30) {
            // Inside church: deep warm darkness
            color.h = 0.07; color.s = 0.3; color.l = 0.05 + altitude * 0.002;
        } else if (altitude < 45) {
            // Transition through ceiling
            color.h = 0.6; color.s = 0.2; color.l = 0.11 + (altitude - 30) * 0.005;
        } else if (altitude < 100) {
            // Night sky
            color.h = 0.65; color.s = 0.35; color.l = 0.08;
        } else {
            color.h = 0.68; color.s = 0.4; color.l = Math.max(0.03, 0.08 - (altitude - 100) * 0.001);
        }
        return color;
    },

    create(THREE, group) {
        const loader = new THREE.TextureLoader();
        function loadTex(path, rx, ry) {
            const t = loader.load(path);
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(rx || 1, ry || 1);
            return t;
        }

        // ── Materials ──
        const floorMat = new THREE.MeshLambertMaterial({ map: loadTex('./assets/church/floor_diff.jpg', 10, 16), side: THREE.DoubleSide });
        const wallMat = new THREE.MeshLambertMaterial({ map: loadTex('./assets/church/wall_diff.jpg', 4, 3), side: THREE.DoubleSide });
        const pillarMat = new THREE.MeshLambertMaterial({ map: loadTex('./assets/church/wall_diff.jpg', 2, 4), side: THREE.DoubleSide });
        const woodMat = new THREE.MeshLambertMaterial({ map: loadTex('./assets/church/wood_diff.jpg', 2, 1), side: THREE.DoubleSide });
        const ceilMat = new THREE.MeshLambertMaterial({ map: loadTex('./assets/church/wall_diff.jpg', 6, 10), side: THREE.DoubleSide });
        const darkStoneMat = new THREE.MeshLambertMaterial({ color: 0x555550 });
        const frameMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
        const goldMat = new THREE.MeshLambertMaterial({ color: 0xc8a84e });
        const carpetMat = new THREE.MeshLambertMaterial({ color: 0x7a1a1a, side: THREE.DoubleSide });

        // ── Church dimensions ──
        const naveLen = 60, naveW = 20, wallH = 25, archH = 33;

        // ── Floor ──
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(naveW, naveLen), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.5;
        floor.receiveShadow = true;
        group.add(floor);

        // ── Red carpet runner down center aisle ──
        const carpet = new THREE.Mesh(new THREE.PlaneGeometry(2.5, naveLen - 8), carpetMat);
        carpet.rotation.x = -Math.PI / 2;
        carpet.position.set(0, -0.48, 3);
        carpet.receiveShadow = true;
        group.add(carpet);

        // ── Walls ──
        for (const s of [-1, 1]) {
            const w = new THREE.Mesh(new THREE.PlaneGeometry(naveLen, wallH), wallMat);
            w.position.set(s * naveW / 2, wallH / 2 - 0.5, 0);
            w.rotation.y = s * -Math.PI / 2;
            group.add(w);
        }
        const backW = new THREE.Mesh(new THREE.PlaneGeometry(naveW, wallH), wallMat);
        backW.position.set(0, wallH / 2 - 0.5, naveLen / 2);
        backW.rotation.y = Math.PI;
        group.add(backW);
        const frontW = new THREE.Mesh(new THREE.PlaneGeometry(naveW, wallH), wallMat);
        frontW.position.set(0, wallH / 2 - 0.5, -naveLen / 2);
        group.add(frontW);

        // ── Pillars with bases ──
        const pillarN = 6;
        const pillarSp = naveLen / (pillarN + 1);
        for (let i = 0; i < pillarN; i++) {
            const z = -naveLen / 2 + pillarSp * (i + 1);
            for (const s of [-1, 1]) {
                const x = s * (naveW / 2 - 1.5);
                const p = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, wallH, 8), pillarMat);
                p.position.set(x, wallH / 2 - 0.5, z);
                p.castShadow = true;
                group.add(p);
                // Base
                const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, 0.5, 8), darkStoneMat);
                base.position.set(x, -0.25, z);
                group.add(base);
            }
        }

        // ── Ceiling ──
        const ceil = new THREE.Mesh(new THREE.PlaneGeometry(naveW - 3, naveLen), ceilMat);
        ceil.position.set(0, archH, 0);
        ceil.rotation.x = Math.PI / 2;
        group.add(ceil);

        // ── Arch ribs ──
        for (let i = 0; i <= pillarN; i++) {
            const z = -naveLen / 2 + pillarSp * (i + 0.5);
            const rib = new THREE.Mesh(new THREE.BoxGeometry(naveW - 3, 0.4, 0.3), darkStoneMat);
            rib.position.set(0, archH - 0.2, z);
            group.add(rib);
        }
        // Center spine rib
        const spine = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, naveLen), darkStoneMat);
        spine.position.set(0, archH - 0.2, 0);
        group.add(spine);

        // ── Stained glass windows with gothic arches + light beams ──
        const glassColors = [
            0xcc2222, 0x2244cc, 0xddaa11, 0x22aa44, 0xaa22aa, 0x22aaaa,
        ];
        const lightBeams = [];
        for (let i = 0; i < pillarN; i++) {
            const z = -naveLen / 2 + pillarSp * (i + 1);
            for (const s of [-1, 1]) {
                const col = glassColors[(i + (s > 0 ? 0 : 3)) % glassColors.length];

                // Gothic pointed arch window shape
                const wShape = new THREE.Shape();
                const ww = 1.2, wh = 8, peak = 2;
                wShape.moveTo(-ww, 0);
                wShape.lineTo(-ww, wh);
                wShape.quadraticCurveTo(-ww, wh + peak, 0, wh + peak + 0.5);
                wShape.quadraticCurveTo(ww, wh + peak, ww, wh);
                wShape.lineTo(ww, 0);
                wShape.lineTo(-ww, 0);

                const glass = new THREE.Mesh(
                    new THREE.ShapeGeometry(wShape),
                    new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
                );
                glass.position.set(s * (naveW / 2 - 0.05), wallH / 2 - 2, z);
                glass.rotation.y = s * Math.PI / 2;
                group.add(glass);

                // Stone frame around window
                const frameOuter = new THREE.Mesh(
                    new THREE.ShapeGeometry(wShape),
                    frameMat
                );
                frameOuter.position.set(s * (naveW / 2 - 0.08), wallH / 2 - 2, z);
                frameOuter.rotation.y = s * Math.PI / 2;
                frameOuter.scale.set(1.1, 1.05, 1);
                group.add(frameOuter);

                // Mullions (vertical + horizontal dividers)
                const mullV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 10, 0.08), frameMat);
                mullV.position.set(s * (naveW / 2 - 0.02), wallH / 2 + 1, z);
                mullV.rotation.y = s * Math.PI / 2;
                group.add(mullV);
                for (let h = 0; h < 2; h++) {
                    const mullH = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 0.08), frameMat);
                    mullH.position.set(s * (naveW / 2 - 0.02), wallH / 2 - 1 + h * 4, z);
                    mullH.rotation.y = s * Math.PI / 2;
                    group.add(mullH);
                }

                // ── Light beam from window (angled transparent plane) ──
                const beamMat = new THREE.MeshBasicMaterial({
                    color: col, transparent: true, opacity: 0.06, side: THREE.DoubleSide,
                    depthWrite: false,
                });
                const beam = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 18), beamMat);
                beam.position.set(s * (naveW / 4), wallH / 2 - 2, z);
                beam.rotation.y = s * Math.PI / 2;
                beam.rotation.x = -0.35;  // angled downward
                lightBeams.push(beam);
                group.add(beam);

                // Floor color patch (light landing on floor)
                const patch = new THREE.Mesh(
                    new THREE.PlaneGeometry(3, 2),
                    new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.08, depthWrite: false })
                );
                patch.rotation.x = -Math.PI / 2;
                patch.position.set(s * 3, -0.47, z);
                group.add(patch);
            }
        }

        // ── Rose window (front wall) ──
        const roseR = 4.5, roseSeg = 12;
        const roseColors = [0xcc2222, 0x2244cc, 0xddaa11, 0x22aa44, 0xaa22aa, 0x22aaaa,
                            0xdd6622, 0x4422cc, 0xccaa22, 0x228844, 0xcc44cc, 0x44aacc];
        for (let i = 0; i < roseSeg; i++) {
            const a1 = (i / roseSeg) * Math.PI * 2;
            const a2 = ((i + 1) / roseSeg) * Math.PI * 2;
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.lineTo(Math.cos(a1) * roseR, Math.sin(a1) * roseR);
            shape.lineTo(Math.cos((a1 + a2) / 2) * roseR * 1.02, Math.sin((a1 + a2) / 2) * roseR * 1.02);
            shape.lineTo(Math.cos(a2) * roseR, Math.sin(a2) * roseR);
            shape.lineTo(0, 0);
            const petal = new THREE.Mesh(
                new THREE.ShapeGeometry(shape),
                new THREE.MeshBasicMaterial({ color: roseColors[i], transparent: true, opacity: 0.6, side: THREE.DoubleSide })
            );
            petal.position.set(0, wallH - 5, -naveLen / 2 + 0.1);
            group.add(petal);
        }
        // Inner circle
        const roseInner = new THREE.Mesh(
            new THREE.CircleGeometry(roseR * 0.35, 16),
            new THREE.MeshBasicMaterial({ color: 0xffdd66, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
        );
        roseInner.position.set(0, wallH - 5, -naveLen / 2 + 0.12);
        group.add(roseInner);
        // Frame rings
        const roseOuter = new THREE.Mesh(new THREE.TorusGeometry(roseR, 0.2, 6, 20), frameMat);
        roseOuter.position.set(0, wallH - 5, -naveLen / 2 + 0.15);
        group.add(roseOuter);
        const roseMid = new THREE.Mesh(new THREE.TorusGeometry(roseR * 0.6, 0.1, 6, 16), frameMat);
        roseMid.position.set(0, wallH - 5, -naveLen / 2 + 0.15);
        group.add(roseMid);
        // Rose light beam (cone of warm light)
        const roseBeam = new THREE.Mesh(
            new THREE.ConeGeometry(6, 20, 8, 1, true),
            new THREE.MeshBasicMaterial({ color: 0xffddaa, transparent: true, opacity: 0.04, side: THREE.DoubleSide, depthWrite: false })
        );
        roseBeam.position.set(0, wallH - 12, -naveLen / 2 + 12);
        roseBeam.rotation.x = Math.PI / 2 + 0.15;
        group.add(roseBeam);

        // ── Pews ──
        for (let i = 0; i < 8; i++) {
            const z = 5 + i * 2.8;
            for (const s of [-1, 1]) {
                const x = s * 4.5;
                const seat = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.12, 0.8), woodMat);
                seat.position.set(x, 0.2, z);
                seat.castShadow = true; seat.receiveShadow = true;
                group.add(seat);
                const back = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.0, 0.1), woodMat);
                back.position.set(x, 0.8, z - 0.35);
                back.castShadow = true; back.receiveShadow = true;
                group.add(back);
                // Pew end
                const end = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.8), woodMat);
                end.position.set(x + s * -1.8, 0.6, z);
                end.castShadow = true;
                group.add(end);
            }
        }

        // ── Altar area ──
        // Raised platform
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(12, 0.4, 8),
            new THREE.MeshLambertMaterial({ map: loadTex('./assets/church/floor_diff.jpg', 4, 3), side: THREE.DoubleSide })
        );
        platform.position.set(0, -0.3, -naveLen / 2 + 6);
        platform.receiveShadow = true;
        group.add(platform);

        // Altar table
        const altar = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 2), new THREE.MeshLambertMaterial({ color: 0xe8dcc0 }));
        altar.position.set(0, 0.55, -naveLen / 2 + 6);
        altar.castShadow = true; altar.receiveShadow = true;
        group.add(altar);
        // Altar cloth (white with gold trim)
        const cloth = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.04, 2.1), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        cloth.position.set(0, 1.32, -naveLen / 2 + 6);
        group.add(cloth);
        const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.3, 0.02), new THREE.MeshBasicMaterial({ color: 0xc8a84e }));
        goldTrim.position.set(0, 1.15, -naveLen / 2 + 7.01);
        group.add(goldTrim);

        // Cross (golden, larger)
        const cv = new THREE.Mesh(new THREE.BoxGeometry(0.25, 5, 0.2), goldMat);
        cv.position.set(0, 4, -naveLen / 2 + 4);
        cv.castShadow = true;
        group.add(cv);
        const ch = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.25, 0.2), goldMat);
        ch.position.set(0, 5.5, -naveLen / 2 + 4);
        ch.castShadow = true;
        group.add(ch);

        // ── Organ pipes (back wall) ──
        const pipeMat = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
        const pipeHeights = [8, 10, 12, 14, 13, 11, 9, 7, 6, 10, 12, 14, 12, 10, 8];
        for (let i = 0; i < pipeHeights.length; i++) {
            const px = (i - 7) * 0.7;
            const ph = pipeHeights[i];
            const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, ph, 6), pipeMat);
            pipe.position.set(px, wallH / 2 + ph / 2 - 5, naveLen / 2 - 1);
            group.add(pipe);
        }
        // Organ case
        const organCase = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 1.5), woodMat);
        organCase.position.set(0, wallH / 2 - 5, naveLen / 2 - 1.2);
        group.add(organCase);

        // ── Tapestry banners between windows ──
        const bannerColors = [0x7a1a1a, 0x1a1a5a, 0x3a1a3a, 0x1a4a1a];
        for (let i = 0; i < pillarN - 1; i++) {
            const z = -naveLen / 2 + pillarSp * (i + 1.5);
            for (const s of [-1, 1]) {
                const bColor = bannerColors[i % bannerColors.length];
                const banner = new THREE.Mesh(
                    new THREE.PlaneGeometry(1.5, 6),
                    new THREE.MeshLambertMaterial({ color: bColor, side: THREE.DoubleSide })
                );
                banner.position.set(s * (naveW / 2 - 0.3), wallH / 2 + 2, z);
                banner.rotation.y = s * Math.PI / 2;
                group.add(banner);
                // Gold cross on banner
                const bCross = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 2), new THREE.MeshBasicMaterial({ color: 0xc8a84e, side: THREE.DoubleSide }));
                bCross.position.set(s * (naveW / 2 - 0.28), wallH / 2 + 2.5, z);
                bCross.rotation.y = s * Math.PI / 2;
                group.add(bCross);
                const bCrossH = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.08), new THREE.MeshBasicMaterial({ color: 0xc8a84e, side: THREE.DoubleSide }));
                bCrossH.position.set(s * (naveW / 2 - 0.28), wallH / 2 + 3, z);
                bCrossH.rotation.y = s * Math.PI / 2;
                group.add(bCrossH);
            }
        }

        // ── Candles (emissive only, no point lights) ──
        const candles = [];
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
        const glowMat = new THREE.MeshBasicMaterial({ color: 0xffcc66, transparent: true, opacity: 0.15, depthWrite: false });
        const waxMat = new THREE.MeshLambertMaterial({ color: 0xfff8dc });

        function addCandle(x, y, z) {
            const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.5, 5), waxMat);
            wax.position.set(x, y + 0.25, z);
            group.add(wax);
            const flame = new THREE.Mesh(new THREE.SphereGeometry(0.07, 4, 3), flameMat);
            flame.position.set(x, y + 0.55, z);
            flame.scale.y = 1.8;
            group.add(flame);
            const glow = new THREE.Mesh(new THREE.SphereGeometry(0.6, 4, 3), glowMat);
            glow.position.set(x, y + 0.55, z);
            group.add(glow);
            candles.push({ flame, baseY: y + 0.55 });
        }

        // Altar candles
        addCandle(-1.5, 1.3, -naveLen / 2 + 6);
        addCandle(1.5, 1.3, -naveLen / 2 + 6);
        addCandle(-0.6, 1.3, -naveLen / 2 + 6);
        addCandle(0.6, 1.3, -naveLen / 2 + 6);

        // Wall sconce candles (sparse)
        for (let i = 0; i < 3; i++) {
            const z = -naveLen / 4 + i * naveLen / 3;
            addCandle(-naveW / 2 + 1.5, 5, z);
            addCandle(naveW / 2 - 1.5, 5, z);
        }

        // ── Scene lights (only 2) ──
        const altarLight = new THREE.PointLight(0xffcc88, 2.5, 50);
        altarLight.position.set(0, 12, -naveLen / 2 + 10);
        altarLight.castShadow = true;
        altarLight.shadow.mapSize.width = 512;
        altarLight.shadow.mapSize.height = 512;
        altarLight.shadow.bias = -0.002;
        altarLight.shadow.radius = 3;
        group.add(altarLight);
        const naveLight = new THREE.PointLight(0xffddaa, 1.8, 60);
        naveLight.position.set(0, 10, 8);
        naveLight.castShadow = true;
        naveLight.shadow.mapSize.width = 512;
        naveLight.shadow.mapSize.height = 512;
        naveLight.shadow.bias = -0.002;
        naveLight.shadow.radius = 3;
        group.add(naveLight);

        // ── Dust motes (golden particles in light beams) ──
        const motes = [];
        const moteMat = new THREE.MeshBasicMaterial({ color: 0xffeeaa, transparent: true, opacity: 0.4 });
        for (let i = 0; i < 35; i++) {
            const m = new THREE.Mesh(new THREE.SphereGeometry(0.04, 3, 3), moteMat);
            m.position.set(
                (Math.random() - 0.5) * naveW * 0.6,
                1 + Math.random() * (archH - 2),
                (Math.random() - 0.5) * naveLen * 0.7
            );
            m.userData = {
                baseX: m.position.x, baseY: m.position.y, baseZ: m.position.z,
                speed: 0.08 + Math.random() * 0.12, phase: Math.random() * Math.PI * 2,
            };
            motes.push(m);
            group.add(m);
        }

        // ── Above ceiling: night sky with clouds + stars ──
        const clouds = [];
        const cloudMat = new THREE.MeshBasicMaterial({ color: 0x334466, transparent: true, opacity: 0.4 });
        for (let i = 0; i < 10; i++) {
            const cloud = new THREE.Group();
            for (let j = 0; j < 4; j++) {
                const puff = new THREE.Mesh(new THREE.SphereGeometry(1 + Math.random(), 5, 4), cloudMat);
                puff.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 1, (Math.random() - 0.5) * 3);
                puff.scale.setScalar(1.5 + Math.random());
                cloud.add(puff);
            }
            cloud.position.set((Math.random() - 0.5) * 60, 55 + Math.random() * 30, (Math.random() - 0.5) * 60);
            cloud.userData = { baseX: cloud.position.x, baseZ: cloud.position.z, driftSpeed: 0.2 + Math.random() * 0.2, driftPhase: Math.random() * Math.PI * 2 };
            clouds.push(cloud);
            group.add(cloud);
        }

        // Moon
        const moonGlow = new THREE.Mesh(
            new THREE.SphereGeometry(5, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xffeedd, transparent: true, opacity: 0.15 })
        );
        moonGlow.position.set(30, 120, -40);
        group.add(moonGlow);
        const moon = new THREE.Mesh(
            new THREE.SphereGeometry(3, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xfff8e8 })
        );
        moon.position.set(30, 120, -40);
        group.add(moon);

        const stars = [];
        const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        for (let i = 0; i < 150; i++) {
            const star = new THREE.Mesh(new THREE.SphereGeometry(0.1 + Math.random() * 0.15, 3, 3), starMat.clone());
            const a = Math.random() * Math.PI * 2;
            const d = 40 + Math.random() * 80;
            star.position.set(Math.cos(a) * d, 90 + Math.random() * 100, Math.sin(a) * d);
            star.userData = { twinkleSpeed: 2 + Math.random() * 3, twinklePhase: Math.random() * Math.PI * 2 };
            stars.push(star);
            group.add(star);
        }

        return { candles, motes, lightBeams, clouds, stars };
    },

    animate(state, time, deltaTime, group) {
        // Candle flicker
        state.candles.forEach(c => {
            c.flame.scale.y = 1.5 + Math.sin(time * 10 + c.baseY * 3) * 0.4;
            c.flame.position.y = c.baseY + Math.sin(time * 7 + c.baseY) * 0.015;
        });

        // Dust motes lazily drifting
        state.motes.forEach(m => {
            const u = m.userData;
            m.position.x = u.baseX + Math.sin(time * u.speed + u.phase) * 2;
            m.position.y = u.baseY + Math.sin(time * u.speed * 0.4 + u.phase) * 0.8;
            m.position.z = u.baseZ + Math.cos(time * u.speed * 0.6 + u.phase) * 1.5;
        });

        // Light beams subtle shimmer
        state.lightBeams.forEach((beam, i) => {
            beam.material.opacity = 0.04 + Math.sin(time * 0.3 + i) * 0.02;
        });

        // Clouds
        state.clouds.forEach(cloud => {
            const c = cloud.userData;
            cloud.position.x = c.baseX + Math.sin(time * c.driftSpeed * 0.1 + c.driftPhase) * 10;
            cloud.position.z = c.baseZ + Math.cos(time * c.driftSpeed * 0.1 + c.driftPhase) * 5;
        });

        // Stars
        state.stars.forEach(star => {
            const s = star.userData;
            star.material.opacity = 0.5 + Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.5;
        });
    },

    interact(state, mesh, point, geoType, ctx) {
        if (geoType === 'BoxGeometry') {
            ctx.kickObject(mesh, point);
        }
    },
};
