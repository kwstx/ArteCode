/**
 * Example Projects for Onboarding
 * 
 * Starter projects with different difficulty levels
 */

export interface ExampleProject {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    concepts: string[];
    estimatedTime: string;
    code: string;
    thumbnail?: string;
}

export const EXAMPLE_PROJECTS: ExampleProject[] = [
    {
        id: 'bouncing-ball',
        title: 'Bouncing Ball',
        description: 'Simple physics simulation with a bouncing ball',
        difficulty: 'beginner',
        concepts: ['animation', 'variables', 'conditionals'],
        estimatedTime: '2 min',
        code: `// ============================================
// SETUP
// ============================================
function setup() {
  createCanvas(800, 600);
}

// Ball properties
let ballY = 50;
let ballSpeed = 0;
let gravity = 0.5;

// ============================================
// DRAW
// ============================================
function draw() {
  background(220);
  
  // Apply gravity
  ballSpeed += gravity;
  ballY += ballSpeed;
  
  // Bounce when hitting bottom
  if (ballY > height - 25) {
    ballY = height - 25;
    ballSpeed *= -0.9; // Bounce with energy loss
  }
  
  // Draw the ball
  fill(255, 100, 100);
  noStroke();
  ellipse(width / 2, ballY, 50, 50);
}`
    },
    {
        id: 'rainbow-circles',
        title: 'Rainbow Circles',
        description: 'Colorful, interactive circles that follow the mouse',
        difficulty: 'beginner',
        concepts: ['HSB color', 'mouse interaction', 'frameCount'],
        estimatedTime: '3 min',
        code: `// ============================================
// SETUP
// ============================================
function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100);
  background(0);
}

// ============================================
// DRAW
// ============================================
function draw() {
  // Fade background
  background(0, 0, 0, 5);
  
  // Rainbow color based on time
  let hue = (frameCount * 2) % 360;
  
  // Draw circle at mouse position
  fill(hue, 80, 100, 50);
  noStroke();
  ellipse(mouseX, mouseY, 50, 50);
}`
    },
    {
        id: 'spiral-pattern',
        title: 'Spiral Pattern',
        description: 'Beautiful geometric spiral using trigonometry',
        difficulty: 'intermediate',
        concepts: ['for loops', 'sin/cos', 'rotation'],
        estimatedTime: '5 min',
        code: `// ============================================
// SETUP
// ============================================
function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100);
}

// ============================================
// DRAW
// ============================================
function draw() {
  background(220);
  
  translate(width / 2, height / 2);
  
  // Draw spiral
  for (let i = 0; i < 100; i++) {
    let angle = i * 0.5;
    let radius = i * 2;
    
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    
    let hue = (i * 3.6 + frameCount) % 360;
    fill(hue, 80, 100);
    noStroke();
    ellipse(x, y, 20, 20);
  }
}`
    },
    {
        id: 'wave-motion',
        title: 'Wave Motion',
        description: 'Smooth wave animation using sine functions',
        difficulty: 'intermediate',
        concepts: ['sin waves', 'map()', 'smooth motion'],
        estimatedTime: '7 min',
        code: `// ============================================
// SETUP
// ============================================
function setup() {
  createCanvas(800, 600);
}

// ============================================
// DRAW
// ============================================
function draw() {
  background(220);
  
  noFill();
  stroke(0, 102, 204);
  strokeWeight(2);
  
  // Draw wave
  beginShape();
  for (let x = 0; x <= width; x += 10) {
    let y = height / 2 + sin((x + frameCount * 2) * 0.02) * 100;
    vertex(x, y);
  }
  endShape();
  
  // Draw moving circle on wave
  let circleX = (frameCount * 2) % width;
  let circleY = height / 2 + sin((circleX + frameCount * 2) * 0.02) * 100;
  
  fill(255, 100, 100);
  noStroke();
  ellipse(circleX, circleY, 20, 20);
}`
    },
    {
        id: 'starry-sky',
        title: 'Starry Sky',
        description: 'Twinkling stars with random positions and brightness',
        difficulty: 'intermediate',
        concepts: ['arrays', 'random', 'transparency'],
        estimatedTime: '8 min',
        code: `// ============================================
// SETUP
// ============================================
let stars = [];

function setup() {
  createCanvas(800, 600);
  
  // Create stars
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      twinkle: random(TWO_PI)
    });
  }
}

// ============================================
// DRAW
// ============================================
function draw() {
  background(10, 10, 30);
  
  // Draw stars
  for (let star of stars) {
    let brightness = map(sin(star.twinkle + frameCount * 0.05), -1, 1, 50, 255);
    fill(brightness);
    noStroke();
    ellipse(star.x, star.y, star.size, star.size);
  }
}`
    },
    {
        id: 'particle-system',
        title: 'Particle System',
        description: 'Dynamic particle effects with physics',
        difficulty: 'advanced',
        concepts: ['arrays', 'objects', 'physics', 'classes'],
        estimatedTime: '10 min',
        code: `// ============================================
// SETUP
// ============================================
let particles = [];

function setup() {
  createCanvas(800, 600);
}

// ============================================
// DRAW
// ============================================
function draw() {
  background(0, 0, 0, 25);
  
  // Create new particles at mouse
  if (mouseIsPressed) {
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: mouseX,
        y: mouseY,
        vx: random(-2, 2),
        vy: random(-2, 2),
        life: 255
      });
    }
  }
  
  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1; // Gravity
    p.life -= 2;
    
    fill(100, 150, 255, p.life);
    noStroke();
    ellipse(p.x, p.y, 8, 8);
    
    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}`
    }
];

/**
 * Get examples by difficulty
 */
export function getExamplesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced') {
    return EXAMPLE_PROJECTS.filter((ex) => ex.difficulty === difficulty);
}

/**
 * Get example by ID
 */
export function getExampleById(id: string) {
    return EXAMPLE_PROJECTS.find((ex) => ex.id === id);
}
