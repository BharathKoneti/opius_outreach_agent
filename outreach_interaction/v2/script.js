// Enhanced Three.js scene setup
let scene, camera, renderer, controls;
let agents = [];
let dialogueSystem;
let isPlaying = false;
let chatBubbles = [];
let particles = [];
let holographicDisplays = [];
let dayNightCycle = { isDay: true, transition: 0 };
let animationSpeed = 1;
let soundEnabled = true;
let musicEnabled = false;
let vcDatabase = null;
let currentVC = null;

// Default dialogue scripts (will be overridden by VC-specific ones)
const dialogueScripts = {
    default: [
        { agent: 1, text: "Alright, team. Next on the list: [VC Name]. Big devtools energy. Invested in [Startup Name]... which we all know was basically a startup speedrun.", delay: 0 },
        { agent: 2, text: "Oh, the one who tweeted 'Founders who ship fast win.' Classic. We should definitely mention that... and pretend we didn't stalk all 9,318 of their tweets.", delay: 3000 },
        { agent: 3, text: "I say we start strong: show them the meme demo deck, then drop a git commit as a punchline.", delay: 6000 },
        { agent: 1, text: "No memes. Last time you did that, we got ghosted by a seed fund in SoMa.", delay: 9000 },
        { agent: 2, text: "Let's send them a founder video. Wait... he's the founder? *shows photo* Suspiciously relaxed for someone building multi-agent infra.", delay: 12000 },
        { agent: 3, text: "Relax. It's part of the brand. We ship while he sleeps. He's like... reverse devops.", delay: 15000 },
        { agent: 1, text: "Alright, let's just send them this video. No pitch, no ask. Just vibes. If they get it — they're the one.", delay: 18000 }
    ]
};

// Load VC database
async function loadVCDatabase() {
    try {
        const response = await fetch('vc_database.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        vcDatabase = await response.json();
        console.log('VC database loaded:', vcDatabase);
    } catch (error) {
        console.error('Failed to load VC database:', error);
        // Fallback to default scripts
        vcDatabase = { vcs: [] };
    }
}

// Particle system for thinking effects
class ParticleSystem {
    constructor(position) {
        this.position = position;
        this.particles = [];
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(300);
        this.velocities = [];
        this.lifetimes = [];
        
        for (let i = 0; i < 100; i++) {
            this.velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                Math.random() * 0.02 + 0.01,
                (Math.random() - 0.5) * 0.02
            ));
            this.lifetimes.push(Math.random() * 2 + 1);
        }
        
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x00ff88,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.points = new THREE.Points(this.geometry, material);
        this.active = false;
    }
    
    update() {
        if (!this.active) return;
        
        const positions = this.geometry.attributes.position.array;
        
        for (let i = 0; i < 100; i++) {
            const i3 = i * 3;
            
            if (this.lifetimes[i] <= 0) {
                positions[i3] = this.position.x + (Math.random() - 0.5) * 0.5;
                positions[i3 + 1] = this.position.y;
                positions[i3 + 2] = this.position.z + (Math.random() - 0.5) * 0.5;
                this.lifetimes[i] = Math.random() * 2 + 1;
            } else {
                positions[i3] += this.velocities[i].x;
                positions[i3 + 1] += this.velocities[i].y;
                positions[i3 + 2] += this.velocities[i].z;
                this.lifetimes[i] -= 0.016;
            }
        }
        
        this.geometry.attributes.position.needsUpdate = true;
    }
    
    setActive(active) {
        this.active = active;
        this.points.visible = active;
    }
}

// Enhanced chat bubble with styling
class ChatBubble {
    constructor(text, agentId, position) {
        this.text = text;
        this.agentId = agentId;
        this.position = position;
        this.element = null;
        this.create();
    }

    create() {
        this.element = document.createElement('div');
        this.element.className = 'chat-bubble agent-' + this.agentId;
        this.element.innerHTML = `
            <div class="bubble-content">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
                <div class="bubble-text" style="display: none;">${this.text}</div>
            </div>
            <div class="bubble-tail"></div>
        `;
        document.getElementById('chat-bubbles').appendChild(this.element);
        this.updatePosition();
        
        // Animate in with typing effect
        setTimeout(() => {
            this.element.classList.add('visible');
            
            // Calculate typing duration based on text length
            const wordCount = this.text.split(' ').length;
            const typingDuration = Math.min(wordCount * 100, 2000); // Max 2 seconds
            
            setTimeout(() => {
                this.element.querySelector('.typing-indicator').style.display = 'none';
                this.element.querySelector('.bubble-text').style.display = 'block';
                if (soundEnabled) playSound('notification');
            }, typingDuration);
        }, 100);
    }

    updatePosition() {
        const vector = this.position.clone();
        vector.project(camera);
        
        const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
        const y = (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight;
        
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y - 120}px`;
    }

    remove() {
        this.element.classList.remove('visible');
        setTimeout(() => {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }, 300);
    }
}

// Holographic display for VC data
class HolographicDisplay {
    constructor(position, data) {
        this.position = position;
        this.data = data;
        this.group = new THREE.Group();
        this.createDisplay();
    }
    
    createDisplay() {
        // Hologram base
        const geometry = new THREE.PlaneGeometry(2, 3);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        
        const plane = new THREE.Mesh(geometry, material);
        this.group.add(plane);
        
        // Add hologram effect
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00ff88 }));
        this.group.add(line);
        
        this.group.position.copy(this.position);
        
        // Floating animation
        this.time = 0;
    }
    
    update() {
        this.time += 0.016;
        this.group.position.y = this.position.y + Math.sin(this.time) * 0.1;
        this.group.rotation.y += 0.01;
    }
}

// Enhanced Agent class with multiple monitors and animations
class Agent {
    constructor(id, position, rotation, color) {
        this.id = id;
        this.position = position;
        this.rotation = rotation;
        this.color = color;
        this.group = new THREE.Group();
        this.speaking = false;
        this.typing = false;
        this.chatBubble = null;
        this.particleSystem = null;
        this.monitors = [];
        this.coffee = null;
        this.createModel();
    }

    createModel() {
        // Create desk (larger for multiple monitors)
        const deskGeometry = new THREE.BoxGeometry(4, 0.1, 2.5);
        const deskMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.y = 1;
        desk.castShadow = true;
        desk.receiveShadow = true;
        this.group.add(desk);

        // Create desk legs
        const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1);
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
        const positions = [[-1.8, 0.5, -1], [1.8, 0.5, -1], [-1.8, 0.5, 1], [1.8, 0.5, 1]];
        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(...pos);
            leg.castShadow = true;
            this.group.add(leg);
        });

        // Create multiple monitors
        this.createMonitorSetup();

        // Create keyboard with backlight
        const keyboardGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.4);
        const keyboardMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            emissive: this.color,
            emissiveIntensity: 0.1
        });
        const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
        keyboard.position.set(0, 1.05, 0.3);
        this.group.add(keyboard);

        // Create mouse
        const mouseGeometry = new THREE.BoxGeometry(0.1, 0.02, 0.15);
        const mouseMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        const mouse = new THREE.Mesh(mouseGeometry, mouseMaterial);
        mouse.position.set(0.8, 1.05, 0.3);
        this.group.add(mouse);

        // Create coffee mug
        this.createCoffeeMug();

        // Create chair
        this.createChair();

        // Create agent figure
        this.createAgentFigure();

        // Add desk decorations
        this.addDeskDecorations();

        // Position and rotate the entire group
        this.group.position.copy(this.position);
        this.group.rotation.y = this.rotation;

        // Create particle system for thinking effect
        this.particleSystem = new ParticleSystem(new THREE.Vector3(
            this.position.x,
            this.position.y + 2.5,
            this.position.z
        ));
        scene.add(this.particleSystem.points);
    }

    createMonitorSetup() {
        // Main ultrawide monitor
        const mainMonitorGeometry = new THREE.BoxGeometry(2.5, 1.2, 0.1);
        const monitorMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        const mainMonitor = new THREE.Mesh(mainMonitorGeometry, monitorMaterial);
        mainMonitor.position.set(0, 1.6, -0.5);
        mainMonitor.castShadow = true;
        this.group.add(mainMonitor);

        // Main screen with code visualization
        const mainScreenGeometry = new THREE.BoxGeometry(2.3, 1, 0.01);
        const mainScreenMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x111111,
            emissive: this.color,
            emissiveIntensity: 0.3
        });
        this.mainScreen = new THREE.Mesh(mainScreenGeometry, mainScreenMaterial);
        this.mainScreen.position.set(0, 1.6, -0.45);
        this.group.add(this.mainScreen);
        this.monitors.push(this.mainScreen);

        // Vertical side monitor
        const sideMonitorGeometry = new THREE.BoxGeometry(0.8, 1.4, 0.1);
        const sideMonitor = new THREE.Mesh(sideMonitorGeometry, monitorMaterial);
        sideMonitor.position.set(-1.8, 1.7, -0.3);
        sideMonitor.rotation.y = 0.3;
        sideMonitor.castShadow = true;
        this.group.add(sideMonitor);

        // Side screen
        const sideScreenGeometry = new THREE.BoxGeometry(0.7, 1.2, 0.01);
        this.sideScreen = new THREE.Mesh(sideScreenGeometry, mainScreenMaterial);
        this.sideScreen.position.set(-1.75, 1.7, -0.25);
        this.sideScreen.rotation.y = 0.3;
        this.group.add(this.sideScreen);
        this.monitors.push(this.sideScreen);

        // Monitor stands
        const standGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.3);
        const standMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
        
        const mainStand = new THREE.Mesh(standGeometry, standMaterial);
        mainStand.position.set(0, 1.15, -0.5);
        this.group.add(mainStand);

        const sideStand = new THREE.Mesh(standGeometry, standMaterial);
        sideStand.position.set(-1.8, 1.15, -0.3);
        this.group.add(sideStand);
    }

    createCoffeeMug() {
        const mugGroup = new THREE.Group();
        
        // Mug body
        const mugGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.12);
        const mugMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const mug = new THREE.Mesh(mugGeometry, mugMaterial);
        mugGroup.add(mug);

        // Handle
        const handleGeometry = new THREE.TorusGeometry(0.05, 0.01, 8, 16, Math.PI);
        const handle = new THREE.Mesh(handleGeometry, mugMaterial);
        handle.position.set(0.08, 0, 0);
        handle.rotation.z = -Math.PI / 2;
        mugGroup.add(handle);

        // Coffee
        const coffeeGeometry = new THREE.CylinderGeometry(0.07, 0.055, 0.08);
        const coffeeMaterial = new THREE.MeshPhongMaterial({ color: 0x3d2817 });
        const coffee = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
        coffee.position.y = 0.01;
        mugGroup.add(coffee);

        mugGroup.position.set(1.2, 1.1, 0.5);
        this.group.add(mugGroup);
        this.coffee = mugGroup;
    }

    createChair() {
        const chairMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
        
        // Seat
        const seatGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const seat = new THREE.Mesh(seatGeometry, chairMaterial);
        seat.position.set(0, 0.8, 1.5);
        seat.castShadow = true;
        this.group.add(seat);

        // Backrest
        const backGeometry = new THREE.BoxGeometry(1, 1.2, 0.1);
        const back = new THREE.Mesh(backGeometry, chairMaterial);
        back.position.set(0, 1.4, 2);
        back.castShadow = true;
        this.group.add(back);

        // Armrests
        const armGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.8);
        const leftArm = new THREE.Mesh(armGeometry, chairMaterial);
        leftArm.position.set(-0.5, 1, 1.6);
        this.group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, chairMaterial);
        rightArm.position.set(0.5, 1, 1.6);
        this.group.add(rightArm);

        // Chair base (5-star wheel base)
        const baseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1);
        const base = new THREE.Mesh(baseGeometry, chairMaterial);
        base.position.set(0, 0.3, 1.5);
        this.group.add(base);

        // Central pole
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
        const pole = new THREE.Mesh(poleGeometry, chairMaterial);
        pole.position.set(0, 0.55, 1.5);
        this.group.add(pole);
    }

    createAgentFigure() {
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: this.color });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.set(0, 1.3, 1.5);
        this.body.castShadow = true;
        this.group.add(this.body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.25);
        this.head = new THREE.Mesh(headGeometry, bodyMaterial);
        this.head.position.set(0, 2, 1.5);
        this.head.castShadow = true;
        this.group.add(this.head);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
        
        this.leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
        this.leftArm.position.set(-0.4, 1.3, 1.3);
        this.leftArm.rotation.z = 0.3;
        this.leftArm.rotation.x = -0.8;
        this.group.add(this.leftArm);

        this.rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
        this.rightArm.position.set(0.4, 1.3, 1.3);
        this.rightArm.rotation.z = -0.3;
        this.rightArm.rotation.x = -0.8;
        this.group.add(this.rightArm);

        // Headphones
        const headphoneGeometry = new THREE.TorusGeometry(0.3, 0.03, 8, 16);
        const headphoneMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        const headphones = new THREE.Mesh(headphoneGeometry, headphoneMaterial);
        headphones.position.set(0, 2.1, 1.5);
        headphones.rotation.x = Math.PI / 2;
        this.group.add(headphones);
    }

    addDeskDecorations() {
        // Sticky notes
        const noteGeometry = new THREE.PlaneGeometry(0.2, 0.2);
        const noteMaterials = [
            new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide }),
            new THREE.MeshBasicMaterial({ color: 0xff69b4, side: THREE.DoubleSide }),
            new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.DoubleSide })
        ];

        for (let i = 0; i < 3; i++) {
            const note = new THREE.Mesh(noteGeometry, noteMaterials[i]);
            note.position.set(-1.5 + i * 0.3, 1.1, -0.8);
            note.rotation.x = -0.2;
            note.rotation.y = (Math.random() - 0.5) * 0.3;
            this.group.add(note);
        }

        // Small plant
        const potGeometry = new THREE.CylinderGeometry(0.1, 0.08, 0.15);
        const potMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const pot = new THREE.Mesh(potGeometry, potMaterial);
        pot.position.set(1.5, 1.1, -0.5);
        this.group.add(pot);

        const plantGeometry = new THREE.SphereGeometry(0.15, 8, 6);
        const plantMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
        const plant = new THREE.Mesh(plantGeometry, plantMaterial);
        plant.position.set(1.5, 1.25, -0.5);
        this.group.add(plant);

        // Desk toys based on agent role
        if (this.id === 1) {
            // Rubik's cube for strategist
            const cubeGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
            const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(-1, 1.1, 0.5);
            cube.rotation.y = 0.3;
            this.group.add(cube);
        } else if (this.id === 2) {
            // Stack of books for analyst
            for (let i = 0; i < 3; i++) {
                const bookGeometry = new THREE.BoxGeometry(0.2, 0.03, 0.3);
                const bookMaterial = new THREE.MeshPhongMaterial({ 
                    color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5)
                });
                const book = new THREE.Mesh(bookGeometry, bookMaterial);
                book.position.set(-1, 1.07 + i * 0.03, 0.5);
                book.rotation.y = (Math.random() - 0.5) * 0.2;
                this.group.add(book);
            }
        } else if (this.id === 3) {
            // Action figure for creative director
            const figureGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
            const figureMaterial = new THREE.MeshPhongMaterial({ color: 0x0080ff });
            const figure = new THREE.Mesh(figureGeometry, figureMaterial);
            figure.position.set(-1, 1.15, 0.5);
            this.group.add(figure);
        }
    }

    animate() {
        // Typing animation
        if (this.typing) {
            const time = Date.now() * 0.01;
            
            // Body sway
            this.body.rotation.y = Math.sin(time) * 0.05;
            this.head.rotation.y = Math.sin(time * 1.5) * 0.1;
            
            // Arm movements (typing)
            this.leftArm.rotation.x = -0.8 + Math.sin(time * 3) * 0.1;
            this.rightArm.rotation.x = -0.8 + Math.sin(time * 3 + Math.PI) * 0.1;
            
            // Screen effects
            this.monitors.forEach((monitor, index) => {
                monitor.material.emissiveIntensity = 0.3 + Math.random() * 0.1;
                
                // Simulate code scrolling
                if (Math.random() > 0.95) {
                    monitor.material.emissive = new THREE.Color(
                        this.color.r + Math.random() * 0.2,
                        this.color.g + Math.random() * 0.2,
                        this.color.b + Math.random() * 0.2
                    );
                }
            });

            // Keyboard sound
            if (soundEnabled && Math.random() > 0.8) {
                playSound('keyboard');
            }
        } else {
            // Idle animations
            this.body.rotation.y *= 0.9;
            this.head.rotation.y *= 0.9;
            this.leftArm.rotation.x += (-0.8 - this.leftArm.rotation.x) * 0.1;
            this.rightArm.rotation.x += (-0.8 - this.rightArm.rotation.x) * 0.1;
            
            this.monitors.forEach(monitor => {
                monitor.material.emissiveIntensity = 0.3;
            });
        }

        // Coffee steam effect
        if (this.coffee && Math.random() > 0.98) {
            // Add steam particle effect here
        }

        // Update particle system
        if (this.particleSystem) {
            this.particleSystem.update();
        }

        // Update chat bubble position
        if (this.chatBubble) {
            const bubblePos = new THREE.Vector3();
            this.head.getWorldPosition(bubblePos);
            bubblePos.y += 0.8;
            this.chatBubble.position = bubblePos;
            this.chatBubble.updatePosition();
        }
    }

    setSpeaking(speaking, text = '') {
        this.speaking = speaking;
        this.typing = speaking;
        
        const statusElement = document.getElementById(`agent${this.id}-status`);
        const statusText = statusElement.querySelector('.status-text');
        const indicator = statusElement.querySelector('.agent-indicator');
        const cpuValue = statusElement.querySelector('.cpu-value');
        const taskValue = statusElement.querySelector('.task-value');
        
        if (speaking) {
            statusText.textContent = 'Speaking';
            indicator.classList.add('active');
            cpuValue.textContent = Math.floor(40 + Math.random() * 30) + '%';
            taskValue.textContent = Math.floor(1 + Math.random() * 3);
            
            // Activate particle system
            if (this.particleSystem) {
                this.particleSystem.setActive(true);
            }
            
            // Create chat bubble
            if (text) {
                this.showChatBubble(text);
            }
        } else {
            statusText.textContent = 'Ready';
            indicator.classList.remove('active');
            cpuValue.textContent = Math.floor(5 + Math.random() * 10) + '%';
            taskValue.textContent = '0';
            
            // Deactivate particle system
            if (this.particleSystem) {
                this.particleSystem.setActive(false);
            }
            
            this.hideChatBubble();
        }
    }

    showChatBubble(text) {
        this.hideChatBubble();
        const bubblePos = new THREE.Vector3();
        this.head.getWorldPosition(bubblePos);
        bubblePos.y += 0.8;
        this.chatBubble = new ChatBubble(text, this.id, bubblePos);
        chatBubbles.push(this.chatBubble);
    }

    hideChatBubble() {
        if (this.chatBubble) {
            this.chatBubble.remove();
            const index = chatBubbles.indexOf(this.chatBubble);
            if (index > -1) {
                chatBubbles.splice(index, 1);
            }
            this.chatBubble = null;
        }
    }
}

// Enhanced dialogue system
class DialogueSystem {
    constructor() {
        this.currentScript = dialogueScripts.default;
        this.currentIndex = 0;
        this.timeouts = [];
    }

    updateScript(vcData, startupName, hook) {
        if (vcData && vcData.dialogue_scenarios) {
            // Use VC-specific dialogue
            this.currentScript = vcData.dialogue_scenarios.map((line, index) => ({
                ...line,
                delay: index * 3000,
                text: line.text
                    .replace('[Startup Name]', startupName || 'Opius AI')
                    .replace('[Hook]', hook || 'AI agents that actually work')
            }));
        } else {
            // Fallback to default
            this.currentScript = dialogueScripts.default.map(line => ({
                ...line,
                text: line.text
                    .replace('[VC Name]', vcData?.name || '[VC Name]')
                    .replace('[Startup Name]', startupName || '[Startup Name]')
            }));
        }
        
        // Calculate recommended speed based on average text length
        this.updateSpeedRecommendation();
    }
    
    updateSpeedRecommendation() {
        const totalWords = this.currentScript.reduce((sum, line) => 
            sum + line.text.split(' ').length, 0);
        const avgWordsPerLine = totalWords / this.currentScript.length;
        
        // Recommend slower speed for longer average text
        let recommendedSpeed = 1;
        if (avgWordsPerLine > 30) {
            recommendedSpeed = 0.7;
        } else if (avgWordsPerLine > 20) {
            recommendedSpeed = 0.85;
        } else if (avgWordsPerLine < 10) {
            recommendedSpeed = 1.3;
        }
        
        // Update UI
        const speedSlider = document.getElementById('speed-slider');
        const speedTip = document.getElementById('speed-recommendation');
        
        speedTip.textContent = `Recommended: ${recommendedSpeed}x`;
        speedTip.classList.add('visible');
        
        // Flash the recommendation
        setTimeout(() => {
            speedTip.style.background = 'rgba(0, 255, 136, 0.3)';
            setTimeout(() => {
                speedTip.style.background = 'rgba(0, 255, 136, 0.1)';
            }, 300);
        }, 100);
    }

    start() {
        this.stop();
        this.currentIndex = 0;
        this.playNext();
    }

    playNext() {
        if (this.currentIndex >= this.currentScript.length) {
            this.currentIndex = 0;
            return;
        }

        const line = this.currentScript[this.currentIndex];
        
        // Calculate delay based on previous line's text length
        let delay = 0;
        if (this.currentIndex > 0) {
            const prevLine = this.currentScript[this.currentIndex - 1];
            const wordCount = prevLine.text.split(' ').length;
            // Base reading speed: ~200 words per minute (3.3 words per second)
            // So each word needs about 300ms, plus some buffer time
            const readingTime = (wordCount * 300) + 1500; // 1.5s minimum buffer
            delay = readingTime / animationSpeed;
        }
        
        const timeout = setTimeout(() => {
            this.displayDialogue(line);
            this.currentIndex++;
            if (isPlaying) {
                this.playNext();
            }
        }, delay);
        
        this.timeouts.push(timeout);
    }

    displayDialogue(line) {
        // Add to log
        const dialogueContent = document.querySelector('.dialogue-content');
        const dialogueItem = document.createElement('div');
        dialogueItem.className = 'dialogue-item';
        dialogueItem.innerHTML = `
            <div class="dialogue-header">
                <span class="agent-label">Agent ${line.agent}</span>
                <span class="timestamp">${getCurrentTime()}</span>
            </div>
            <span class="agent-text">${line.text}</span>
            <div class="reading-progress">
                <div class="progress-bar"></div>
            </div>
        `;
        dialogueContent.appendChild(dialogueItem);
        dialogueContent.scrollTop = dialogueContent.scrollHeight;
        
        // Animate reading progress bar
        const progressBar = dialogueItem.querySelector('.progress-bar');
        const wordCount = line.text.split(' ').length;
        const readingDuration = (wordCount * 300) + 1500;
        
        // Start the progress animation
        setTimeout(() => {
            progressBar.style.transition = `width ${readingDuration / animationSpeed}ms linear`;
            progressBar.style.width = '100%';
        }, 100);

        // Set agent speaking state
        agents.forEach(agent => agent.setSpeaking(false));
        if (agents[line.agent - 1]) {
            agents[line.agent - 1].setSpeaking(true, line.text);
            
            // Calculate speaking duration based on text length
            const wordCount = line.text.split(' ').length;
            const speakingDuration = (wordCount * 300) + 1000; // Slightly less than reading time
            
            setTimeout(() => agents[line.agent - 1].setSpeaking(false), speakingDuration / animationSpeed);
        }

        // Create holographic display for certain keywords
        if (line.text.includes('VC Name') && holographicDisplays.length < 3) {
            const display = new HolographicDisplay(
                new THREE.Vector3(
                    (Math.random() - 0.5) * 8,
                    4,
                    (Math.random() - 0.5) * 4
                ),
                { name: 'VC Data', type: 'Profile' }
            );
            scene.add(display.group);
            holographicDisplays.push(display);
        }
    }

    stop() {
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts = [];
        agents.forEach(agent => agent.setSpeaking(false));
    }

    reset() {
        this.stop();
        this.currentIndex = 0;
        document.querySelector('.dialogue-content').innerHTML = '';
        chatBubbles.forEach(bubble => bubble.remove());
        chatBubbles = [];
        
        // Remove holographic displays
        holographicDisplays.forEach(display => {
            scene.remove(display.group);
        });
        holographicDisplays = [];
    }
}

// Camera preset positions
const cameraPresets = {
    overview: { position: new THREE.Vector3(10, 8, 15), target: new THREE.Vector3(0, 1, 0) },
    agent1: { position: new THREE.Vector3(-5, 3, 3), target: new THREE.Vector3(-5, 1.5, -2) },
    agent2: { position: new THREE.Vector3(0, 3, 3), target: new THREE.Vector3(0, 1.5, -3) },
    agent3: { position: new THREE.Vector3(5, 3, 3), target: new THREE.Vector3(5, 1.5, -2) },
    cinematic: { position: new THREE.Vector3(8, 6, 12), target: new THREE.Vector3(0, 1, 0) }
};

// Initialize scene
async function init() {
    console.log('Initializing 3D scene...');
    
    try {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js not loaded');
        }
        
        // Load VC database first
        await loadVCDatabase();
        
        // Scene setup
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x1a1a1a, 10, 50);

        // Camera setup
        const container = document.getElementById('three-container');
        if (!container) {
            throw new Error('Three container not found');
        }
        
        const width = container.clientWidth || window.innerWidth * 0.7;
        const height = container.clientHeight || window.innerHeight;
        
        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(10, 8, 15);
        camera.lookAt(0, 1, 0);

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        // Controls
        if (typeof THREE.OrbitControls === 'undefined') {
            console.warn('OrbitControls not loaded, using static camera');
            controls = {
                update: () => {},
                target: new THREE.Vector3(0, 1, 0)
            };
        } else {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 5;
            controls.maxDistance = 30;
            controls.maxPolarAngle = Math.PI / 2;
        }

        // Create office environment
        createOfficeEnvironment();

        // Create agents
        agents.push(new Agent(1, new THREE.Vector3(-6, 0, -2), 0.4, 0x00ff88));
        agents.push(new Agent(2, new THREE.Vector3(0, 0, -3), 0, 0x0088ff));
        agents.push(new Agent(3, new THREE.Vector3(6, 0, -2), -0.4, 0xff0088));

        agents.forEach(agent => {
            scene.add(agent.group);
        });

        // Initialize systems
        dialogueSystem = new DialogueSystem();
        dialogueSystem.updateSpeedRecommendation(); // Show initial recommendation
        setupControls();
        setupMiniMap();

        console.log('3D scene initialized successfully');
        
        // Start animation loop
        animate();
    } catch (error) {
        console.error('Error initializing 3D scene:', error);
        // Show error message to user
        const container = document.getElementById('three-container');
        if (container) {
            container.innerHTML = '<div style="color: white; padding: 20px; text-align: center;">Error loading 3D scene. Please refresh the page.</div>';
        }
    }
}

function createOfficeEnvironment() {
    // Dynamic lighting setup
    updateLighting();

    // Create floor with reflective material
    const floorGeometry = new THREE.PlaneGeometry(40, 40);
    const floorMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x404040,
        shininess: 100,
        reflectivity: 0.5
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Create walls with windows
    createWalls();

    // Add office decorations
    createOfficeDecorations();

    // Create ceiling with lights
    createCeiling();
}

function createWalls() {
    const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
    
    // Back wall with windows
    const backWallGeometry = new THREE.BoxGeometry(40, 10, 0.5);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 5, -20);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Windows
    const windowGeometry = new THREE.BoxGeometry(8, 6, 0.1);
    const windowMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.3,
        emissive: 0x87ceeb,
        emissiveIntensity: 0.1
    });

    for (let i = -1; i <= 1; i++) {
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.set(i * 12, 5, -19.7);
        scene.add(window);
    }

    // Side walls
    const sideWallGeometry = new THREE.BoxGeometry(0.5, 10, 40);
    
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(-20, 5, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.set(20, 5, 0);
    rightWall.receiveShadow = true;
    scene.add(rightWall);
}

function createCeiling() {
    const ceilingGeometry = new THREE.PlaneGeometry(40, 40);
    const ceilingMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.y = 10;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Ceiling lights
    for (let x = -10; x <= 10; x += 10) {
        for (let z = -10; z <= 10; z += 10) {
            const lightFixture = new THREE.BoxGeometry(2, 0.2, 2);
            const lightMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 0.5
            });
            const light = new THREE.Mesh(lightFixture, lightMaterial);
            light.position.set(x, 9.8, z);
            scene.add(light);

            // Add point light
            const pointLight = new THREE.PointLight(0xffffff, 0.5, 15);
            pointLight.position.set(x, 9.5, z);
            scene.add(pointLight);
        }
    }
}

function createOfficeDecorations() {
    // Whiteboard
    const whiteboardGeometry = new THREE.BoxGeometry(6, 3, 0.2);
    const whiteboardMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const whiteboard = new THREE.Mesh(whiteboardGeometry, whiteboardMaterial);
    whiteboard.position.set(0, 3.5, -19.5);
    whiteboard.castShadow = true;
    scene.add(whiteboard);

    // Server rack
    const serverGeometry = new THREE.BoxGeometry(2, 6, 1);
    const serverMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const serverRack = new THREE.Mesh(serverGeometry, serverMaterial);
    serverRack.position.set(-15, 3, -15);
    serverRack.castShadow = true;
    scene.add(serverRack);

    // Blinking server lights
    for (let i = 0; i < 10; i++) {
        const lightGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const lightMaterial = new THREE.MeshBasicMaterial({ 
            color: Math.random() > 0.5 ? 0x00ff00 : 0xff0000
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(-14.5, 1 + i * 0.5, -14.5);
        scene.add(light);
        
        // Animate blinking
        setInterval(() => {
            light.visible = Math.random() > 0.3;
        }, 500 + Math.random() * 1000);
    }

    // Large plants
    for (let i = 0; i < 4; i++) {
        const plantGeometry = new THREE.CylinderGeometry(0.5, 0.6, 2);
        const plantMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
        const plant = new THREE.Mesh(plantGeometry, plantMaterial);
        const positions = [[-15, 1, -5], [15, 1, -5], [-15, 1, 10], [15, 1, 10]];
        plant.position.set(...positions[i]);
        plant.castShadow = true;
        scene.add(plant);
    }

    // Neon sign
    const neonText = "SHIPPING CODE 24/7";
    const loader = new THREE.FontLoader();
    // Note: In real implementation, you'd load a font file
    // For now, we'll create a simple box as placeholder
    const signGeometry = new THREE.BoxGeometry(8, 1, 0.2);
    const signMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2
    });
    const neonSign = new THREE.Mesh(signGeometry, signMaterial);
    neonSign.position.set(0, 8, -19);
    scene.add(neonSign);

    // Add glow effect to neon sign
    const glowGeometry = new THREE.BoxGeometry(8.5, 1.5, 0.3);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00,
        transparent: true,
        opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(0, 8, -18.9);
    scene.add(glow);
}

function updateLighting() {
    // Clear existing lights
    const lights = scene.children.filter(child => child instanceof THREE.Light && 
        !(child instanceof THREE.PointLight));
    lights.forEach(light => scene.remove(light));

    if (dayNightCycle.isDay) {
        // Day lighting
        scene.background = new THREE.Color(0x87ceeb);
        scene.fog.color = new THREE.Color(0x87ceeb);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffd700, 0.8);
        sunLight.position.set(10, 20, 5);
        sunLight.castShadow = true;
        sunLight.shadow.camera.near = 0.1;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.camera.left = -20;
        sunLight.shadow.camera.right = 20;
        sunLight.shadow.camera.top = 20;
        sunLight.shadow.camera.bottom = -20;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        scene.add(sunLight);
    } else {
        // Night lighting
        scene.background = new THREE.Color(0x0a0a0a);
        scene.fog.color = new THREE.Color(0x0a0a0a);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        scene.add(ambientLight);

        const moonLight = new THREE.DirectionalLight(0x6495ed, 0.3);
        moonLight.position.set(-10, 20, -5);
        moonLight.castShadow = true;
        scene.add(moonLight);
    }
}

// Sound effects
function playSound(type) {
    if (!soundEnabled) return;
    
    // Note: In real implementation, you'd use actual audio elements
    // For now, we'll just log the sound
    console.log(`Playing sound: ${type}`);
}

// Helper functions
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

function displayVCDetails(vc) {
    document.getElementById('vc-details').style.display = 'block';
    document.getElementById('vc-name-display').textContent = vc.name;
    document.getElementById('vc-firm').textContent = `Firm: ${vc.firm}`;
    document.getElementById('vc-twitter').textContent = `Twitter: ${vc.twitter}`;
    
    // Display traits
    const traitsDiv = document.getElementById('vc-traits');
    traitsDiv.innerHTML = '<strong>Known for:</strong> ' + 
        vc.personality.traits.map(trait => `<span class="trait-badge">${trait}</span>`).join(' ');
    
    // Display interests
    const interestsDiv = document.getElementById('vc-interests');
    interestsDiv.innerHTML = '<strong>Interests:</strong> ' + 
        vc.interests.map(interest => `<span class="interest-badge">${interest}</span>`).join(' ');
}

function setupMiniMap() {
    const canvas = document.getElementById('minimap-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 150;
    canvas.height = 150;
    
    // Mini map will be updated in the animate loop
}

function updateMiniMap() {
    const canvas = document.getElementById('minimap-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 150, 150);
    
    // Draw office outline
    ctx.strokeStyle = '#444';
    ctx.strokeRect(10, 10, 130, 130);
    
    // Draw agents
    agents.forEach((agent, index) => {
        const x = 75 + agent.position.x * 4;
        const z = 75 + agent.position.z * 4;
        
        ctx.fillStyle = agent.speaking ? '#00ff88' : '#666';
        ctx.beginPath();
        ctx.arc(x, z, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.fillText(index + 1, x - 3, z + 3);
    });
    
    // Draw camera position
    const camX = 75 + camera.position.x * 2;
    const camZ = 75 + camera.position.z * 2;
    
    ctx.strokeStyle = '#0088ff';
    ctx.beginPath();
    ctx.moveTo(camX, camZ);
    ctx.lineTo(camX + Math.sin(camera.rotation.y) * 10, 
               camZ + Math.cos(camera.rotation.y) * 10);
    ctx.stroke();
}

function setupControls() {
    // VC Card Selection
    document.querySelectorAll('.vc-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Remove previous selection
            document.querySelectorAll('.vc-card').forEach(c => c.classList.remove('selected'));
            
            // Add selection to clicked card
            card.classList.add('selected');
            
            // Get VC data
            const vcId = card.getAttribute('data-vc');
            if (vcId && vcDatabase) {
                currentVC = vcDatabase.vcs.find(vc => vc.id === vcId);
                if (currentVC) {
                    // Show selected VC section
                    document.querySelector('.vc-selector-section').style.display = 'none';
                    document.getElementById('selected-vc-section').style.display = 'block';
                    document.getElementById('selected-vc-name').textContent = currentVC.name;
                    document.getElementById('vc-name').textContent = currentVC.name;
                }
            }
        });
    });

    // Change VC button
    document.getElementById('change-vc').addEventListener('click', () => {
        document.getElementById('selected-vc-section').style.display = 'none';
        document.querySelector('.vc-selector-section').style.display = 'block';
        document.querySelector('.playback-controls').style.display = 'none';
        dialogueSystem.reset();
        isPlaying = false;
    });

    // Start Pitch button
    document.getElementById('start-pitch').addEventListener('click', () => {
        if (!currentVC) return;
        
        const startupName = document.getElementById('startup-input').value || 'Opius AI';
        const hook = document.getElementById('hook-input').value || 'AI agents that actually work';
        
        // Update dialogue system with VC-specific script
        dialogueSystem.updateScript(currentVC, startupName, hook);
        
        // Show playback controls
        document.querySelector('.playback-controls').style.display = 'flex';
        document.querySelector('.action-buttons').style.display = 'none';
        
        // Start conversation
        isPlaying = true;
        dialogueSystem.start();
    });

    // Playback controls
    document.getElementById('pause-conversation').addEventListener('click', () => {
        if (isPlaying) {
            isPlaying = false;
            dialogueSystem.stop();
            document.getElementById('pause-conversation').textContent = '▶';
        } else {
            isPlaying = true;
            dialogueSystem.start();
            document.getElementById('pause-conversation').textContent = '⏸';
        }
    });

    document.getElementById('reset-conversation').addEventListener('click', () => {
        isPlaying = false;
        dialogueSystem.reset();
        document.querySelector('.action-buttons').style.display = 'block';
        document.querySelector('.playback-controls').style.display = 'none';
        document.getElementById('pause-conversation').textContent = '⏸';
    });

    // Speed control
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    speedSlider.addEventListener('input', (e) => {
        animationSpeed = parseFloat(e.target.value);
        speedValue.textContent = animationSpeed + 'x';
    });

    // View controls
    document.querySelectorAll('.view-btn[data-preset]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            document.querySelectorAll('.view-btn[data-preset]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const preset = cameraPresets[btn.dataset.preset];
            if (preset && typeof TWEEN !== 'undefined') {
                // Animate camera to preset position
                new TWEEN.Tween(camera.position)
                    .to(preset.position, 1000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();
                
                new TWEEN.Tween(controls.target)
                    .to(preset.target, 1000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(() => controls.update())
                    .start();
            } else if (preset) {
                // Fallback without animation
                camera.position.copy(preset.position);
                controls.target.copy(preset.target);
                controls.update();
            }
        });
    });

    // Day/night toggle
    document.getElementById('toggle-day-night').addEventListener('click', (e) => {
        dayNightCycle.isDay = !dayNightCycle.isDay;
        updateLighting();
        const btn = e.currentTarget;
        btn.querySelector('.view-icon').textContent = dayNightCycle.isDay ? '🌙' : '☀️';
        btn.querySelector('span:last-child').textContent = dayNightCycle.isDay ? 'Night' : 'Day';
    });

    // Window resize
    window.addEventListener('resize', () => {
        const container = document.getElementById('three-container');
        if (container && camera && renderer) {
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Update TWEEN animations
    if (typeof TWEEN !== 'undefined') {
        TWEEN.update();
    }

    // Update controls
    controls.update();

    // Animate agents
    agents.forEach(agent => agent.animate());

    // Update holographic displays
    holographicDisplays.forEach(display => display.update());

    // Update particle systems
    particles.forEach(particle => particle.update());

    // Update chat bubble positions
    chatBubbles.forEach(bubble => bubble.updatePosition());

    // Update time display
    document.getElementById('time').textContent = getCurrentTime();

    // Update mini map
    updateMiniMap();

    // Render scene
    renderer.render(scene, camera);
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    init().catch(error => {
        console.error('Failed to initialize:', error);
    });
});