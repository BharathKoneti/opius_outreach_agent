// Three.js scene setup
let scene, camera, renderer, controls;
let agents = [];
let dialogueSystem;
let isPlaying = false;
let chatBubbles = [];
let vcDatabase = null;
let currentVC = null;
let animationSpeed = 1;

// Agent dialogue scripts
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
        vcDatabase = await response.json();
        console.log('VC database loaded:', vcDatabase);
    } catch (error) {
        console.error('Failed to load VC database:', error);
        vcDatabase = { vcs: [] };
    }
}

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
        this.element.className = 'chat-bubble';
        this.element.innerHTML = `
            <div class="bubble-content">${this.text}</div>
            <div class="bubble-tail"></div>
        `;
        document.getElementById('chat-bubbles').appendChild(this.element);
        this.updatePosition();
        
        // Animate in
        setTimeout(() => {
            this.element.classList.add('visible');
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
        this.createModel();
    }

    createModel() {
        // Create desk
        const deskGeometry = new THREE.BoxGeometry(3, 0.1, 2);
        const deskMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.y = 1;
        this.group.add(desk);

        // Create desk legs
        const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1);
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
        const positions = [[-1.3, 0.5, -0.8], [1.3, 0.5, -0.8], [-1.3, 0.5, 0.8], [1.3, 0.5, 0.8]];
        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(...pos);
            this.group.add(leg);
        });

        // Create computer monitor
        const monitorGeometry = new THREE.BoxGeometry(1.5, 1, 0.1);
        const monitorMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
        monitor.position.set(0, 1.6, -0.5);
        this.group.add(monitor);

        // Create screen
        const screenGeometry = new THREE.BoxGeometry(1.3, 0.8, 0.01);
        const screenMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x111111,
            emissive: this.color,
            emissiveIntensity: 0.3
        });
        this.screen = new THREE.Mesh(screenGeometry, screenMaterial);
        this.screen.position.set(0, 1.6, -0.45);
        this.group.add(this.screen);

        // Create monitor stand
        const standGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.3);
        const standMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
        const stand = new THREE.Mesh(standGeometry, standMaterial);
        stand.position.set(0, 1.15, -0.5);
        this.group.add(stand);

        // Create keyboard
        const keyboardGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.4);
        const keyboardMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
        keyboard.position.set(0, 1.05, 0.3);
        this.group.add(keyboard);

        // Create chair
        const chairSeatGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const chairMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
        const chairSeat = new THREE.Mesh(chairSeatGeometry, chairMaterial);
        chairSeat.position.set(0, 0.8, 1.5);
        this.group.add(chairSeat);

        // Chair back
        const chairBackGeometry = new THREE.BoxGeometry(1, 1.2, 0.1);
        const chairBack = new THREE.Mesh(chairBackGeometry, chairMaterial);
        chairBack.position.set(0, 1.4, 2);
        this.group.add(chairBack);

        // Chair legs
        const chairLegPositions = [[-0.4, 0.4, 1.2], [0.4, 0.4, 1.2], [-0.4, 0.4, 1.8], [0.4, 0.4, 1.8]];
        chairLegPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(...pos);
            this.group.add(leg);
        });

        // Create simple agent figure (sitting)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: this.color });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.set(0, 1.3, 1.5);
        this.group.add(this.body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.25);
        const headMaterial = new THREE.MeshPhongMaterial({ color: this.color });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.set(0, 2, 1.5);
        this.group.add(this.head);

        // Arms (simplified)
        const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
        const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
        leftArm.position.set(-0.4, 1.3, 1.3);
        leftArm.rotation.z = 0.3;
        leftArm.rotation.x = -0.8;
        this.group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
        rightArm.position.set(0.4, 1.3, 1.3);
        rightArm.rotation.z = -0.3;
        rightArm.rotation.x = -0.8;
        this.group.add(rightArm);

        // Position and rotate the entire group
        this.group.position.copy(this.position);
        this.group.rotation.y = this.rotation;
    }

    animate() {
        // Typing animation
        if (this.typing) {
            const time = Date.now() * 0.01;
            this.body.rotation.y = Math.sin(time) * 0.05;
            this.head.rotation.y = Math.sin(time * 1.5) * 0.1;
            
            // Screen flicker effect
            this.screen.material.emissiveIntensity = 0.3 + Math.random() * 0.1;
        } else {
            this.body.rotation.y *= 0.9;
            this.head.rotation.y *= 0.9;
            this.screen.material.emissiveIntensity = 0.3;
        }

        // Update chat bubble position if exists
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
        
        if (speaking) {
            statusText.textContent = 'Speaking';
            indicator.classList.add('active');
            
            // Create chat bubble
            if (text) {
                this.showChatBubble(text);
            }
        } else {
            statusText.textContent = 'Ready';
            indicator.classList.remove('active');
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
        const timeout = setTimeout(() => {
            this.displayDialogue(line);
            this.currentIndex++;
            if (isPlaying) {
                this.playNext();
            }
        }, this.currentIndex === 0 ? 0 : 4000);
        
        this.timeouts.push(timeout);
    }

    displayDialogue(line) {
        // Add to log
        const dialogueContent = document.querySelector('.dialogue-content');
        const dialogueItem = document.createElement('div');
        dialogueItem.className = 'dialogue-item';
        dialogueItem.innerHTML = `
            <span class="agent-label">Agent ${line.agent}:</span>
            <span class="agent-text">${line.text}</span>
        `;
        dialogueContent.appendChild(dialogueItem);
        dialogueContent.scrollTop = dialogueContent.scrollHeight;

        // Set agent speaking state
        agents.forEach(agent => agent.setSpeaking(false));
        if (agents[line.agent - 1]) {
            agents[line.agent - 1].setSpeaking(true, line.text);
            setTimeout(() => agents[line.agent - 1].setSpeaking(false), 3500);
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
    }
}

async function init() {
    // Load VC database first
    await loadVCDatabase();
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a2a2a);
    scene.fog = new THREE.Fog(0x2a2a2a, 10, 50);

    // Camera setup
    const container = document.getElementById('three-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(8, 6, 12);
    camera.lookAt(0, 1, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('three-container').appendChild(renderer.domElement);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI / 2;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -15;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 15;
    directionalLight.shadow.camera.bottom = -15;
    scene.add(directionalLight);

    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x404040 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Create walls
    const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
    
    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(30, 10);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 5, -15);
    scene.add(backWall);

    // Side walls
    const sideWallGeometry = new THREE.PlaneGeometry(30, 10);
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(-15, 5, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.set(15, 5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Create agents with desks arranged in a semi-circle
    agents.push(new Agent(1, new THREE.Vector3(-5, 0, -2), 0.3, 0x00ff00));
    agents.push(new Agent(2, new THREE.Vector3(0, 0, -3), 0, 0x0080ff));
    agents.push(new Agent(3, new THREE.Vector3(5, 0, -2), -0.3, 0xff0080));

    agents.forEach(agent => {
        scene.add(agent.group);
    });

    // Add some office decorations
    // Whiteboard
    const whiteboardGeometry = new THREE.BoxGeometry(4, 2, 0.1);
    const whiteboardMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const whiteboard = new THREE.Mesh(whiteboardGeometry, whiteboardMaterial);
    whiteboard.position.set(0, 3, -14.9);
    scene.add(whiteboard);

    // Plants
    const plantGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1);
    const plantMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
    const plant1 = new THREE.Mesh(plantGeometry, plantMaterial);
    plant1.position.set(-10, 0.5, -10);
    scene.add(plant1);

    const plant2 = new THREE.Mesh(plantGeometry, plantMaterial);
    plant2.position.set(10, 0.5, -10);
    scene.add(plant2);

    // Initialize dialogue system
    dialogueSystem = new DialogueSystem();

    // Set up controls
    setupControls();

    // Start animation loop
    animate();
}

function setupControls() {
    document.getElementById('start-conversation').addEventListener('click', () => {
        isPlaying = true;
        dialogueSystem.start();
    });

    document.getElementById('pause-conversation').addEventListener('click', () => {
        isPlaying = false;
        dialogueSystem.stop();
    });

    document.getElementById('reset-conversation').addEventListener('click', () => {
        isPlaying = false;
        dialogueSystem.reset();
    });

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
    const changeBtn = document.getElementById('change-vc');
    if (changeBtn) {
        changeBtn.addEventListener('click', () => {
            document.getElementById('selected-vc-section').style.display = 'none';
            document.querySelector('.vc-selector-section').style.display = 'block';
            document.querySelector('.playback-controls').style.display = 'none';
            dialogueSystem.reset();
            isPlaying = false;
        });
    }

    // Start Pitch button
    const startBtn = document.getElementById('start-pitch');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
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
    }

    // Handle window resize
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

    // Update controls
    controls.update();

    // Animate agents
    agents.forEach(agent => agent.animate());

    // Update chat bubble positions
    chatBubbles.forEach(bubble => bubble.updatePosition());

    renderer.render(scene, camera);
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    init().catch(error => {
        console.error('Failed to initialize:', error);
    });
});