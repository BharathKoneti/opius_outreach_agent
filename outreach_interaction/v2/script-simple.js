// Simplified version without external dependencies
let scene, camera, renderer;
let agents = [];
let vcDatabase = { vcs: [] };
let currentVC = null;
let isPlaying = false;
let animationSpeed = 1;

// Simple dialogue system
class DialogueSystem {
    constructor() {
        this.currentScript = [];
        this.currentIndex = 0;
        this.timeouts = [];
    }
    
    updateScript(vcData, startupName, hook) {
        if (vcData && vcData.dialogue_scenarios) {
            this.currentScript = vcData.dialogue_scenarios;
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
        const delay = this.currentIndex === 0 ? 0 : 3000;
        
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
        const dialogueContent = document.querySelector('.dialogue-content');
        if (!dialogueContent) return;
        
        const dialogueItem = document.createElement('div');
        dialogueItem.className = 'dialogue-item';
        dialogueItem.innerHTML = `
            <div class="dialogue-header">
                <span class="agent-label">Agent ${line.agent}</span>
            </div>
            <span class="agent-text">${line.text}</span>
        `;
        dialogueContent.appendChild(dialogueItem);
        dialogueContent.scrollTop = dialogueContent.scrollHeight;
    }
    
    stop() {
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts = [];
    }
    
    reset() {
        this.stop();
        this.currentIndex = 0;
        const dialogueContent = document.querySelector('.dialogue-content');
        if (dialogueContent) {
            dialogueContent.innerHTML = '';
        }
    }
}

const dialogueSystem = new DialogueSystem();

// Initialize 3D scene
function init() {
    console.log('Initializing simplified 3D scene...');
    
    const container = document.getElementById('three-container');
    if (!container) {
        console.error('Container not found');
        return;
    }
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    
    // Camera
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 5);
    scene.add(directionalLight);
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x404040 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    
    // Create simple agents (just colored cubes for now)
    const colors = [0x00ff88, 0x0088ff, 0xff0088];
    const positions = [[-5, 1, 0], [0, 1, 0], [5, 1, 0]];
    
    for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ color: colors[i] });
        const agent = new THREE.Mesh(geometry, material);
        agent.position.set(...positions[i]);
        agents.push(agent);
        scene.add(agent);
    }
    
    // Load VC database
    loadVCDatabase();
    
    // Setup controls
    setupControls();
    
    // Start animation
    animate();
    
    console.log('Scene initialized');
}

// Load VC database
async function loadVCDatabase() {
    try {
        const response = await fetch('vc_database.json');
        vcDatabase = await response.json();
        console.log('VC database loaded');
    } catch (error) {
        console.error('Failed to load VC database:', error);
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate agents
    agents.forEach((agent, i) => {
        agent.rotation.y += 0.01;
        agent.position.y = 1 + Math.sin(Date.now() * 0.001 + i) * 0.2;
    });
    
    renderer.render(scene, camera);
}

// Setup controls
function setupControls() {
    // VC Card Selection
    document.querySelectorAll('.vc-card').forEach(card => {
        card.addEventListener('click', (e) => {
            document.querySelectorAll('.vc-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            const vcId = card.getAttribute('data-vc');
            if (vcId && vcDatabase) {
                currentVC = vcDatabase.vcs.find(vc => vc.id === vcId);
                if (currentVC) {
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
            
            dialogueSystem.updateScript(currentVC, startupName, hook);
            
            const playbackControls = document.querySelector('.playback-controls');
            const actionButtons = document.querySelector('.action-buttons');
            
            if (playbackControls) playbackControls.style.display = 'flex';
            if (actionButtons) actionButtons.style.display = 'none';
            
            isPlaying = true;
            dialogueSystem.start();
        });
    }
    
    // Pause button
    const pauseBtn = document.getElementById('pause-conversation');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                isPlaying = false;
                dialogueSystem.stop();
                pauseBtn.textContent = '▶';
            } else {
                isPlaying = true;
                dialogueSystem.start();
                pauseBtn.textContent = '⏸';
            }
        });
    }
    
    // Reset button
    const resetBtn = document.getElementById('reset-conversation');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            isPlaying = false;
            dialogueSystem.reset();
            
            const playbackControls = document.querySelector('.playback-controls');
            const actionButtons = document.querySelector('.action-buttons');
            
            if (actionButtons) actionButtons.style.display = 'block';
            if (playbackControls) playbackControls.style.display = 'none';
            if (pauseBtn) pauseBtn.textContent = '⏸';
        });
    }
    
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

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        init();
    } else {
        console.error('Three.js not loaded');
        document.getElementById('three-container').innerHTML = 
            '<div style="color: white; padding: 20px; text-align: center;">Error: Three.js library not loaded</div>';
    }
});