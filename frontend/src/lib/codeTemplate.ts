/**
 * Canonical p5.js code template structure
 * This is the ONLY structure allowed for all sketches
 */

export interface SketchTemplate {
    preload?: string;
    setup: string;
    draw: string;
    helpers?: string;
    events?: string;
}

/**
 * Generate a complete sketch from template sections
 */
export function generateSketch(template: SketchTemplate): string {
    const sections: string[] = [];

    // Preload section (optional)
    if (template.preload) {
        sections.push('// ============================================');
        sections.push('// PRELOAD');
        sections.push('// ============================================');
        sections.push('function preload() {');
        sections.push(template.preload);
        sections.push('}');
        sections.push('');
    }

    // Setup section (required)
    sections.push('// ============================================');
    sections.push('// SETUP');
    sections.push('// ============================================');
    sections.push('function setup() {');
    sections.push(template.setup);
    sections.push('}');
    sections.push('');

    // Draw section (required)
    sections.push('// ============================================');
    sections.push('// DRAW');
    sections.push('// ============================================');
    sections.push('function draw() {');
    sections.push(template.draw);
    sections.push('}');

    // Helper functions (optional)
    if (template.helpers) {
        sections.push('');
        sections.push('// ============================================');
        sections.push('// HELPER FUNCTIONS');
        sections.push('// ============================================');
        sections.push(template.helpers);
    }

    // Event handlers (optional)
    if (template.events) {
        sections.push('');
        sections.push('// ============================================');
        sections.push('// EVENT HANDLERS');
        sections.push('// ============================================');
        sections.push(template.events);
    }

    return sections.join('\n');
}

/**
 * Validate that code follows the template structure
 */
export function validateSketch(code: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // Check for required functions
    if (!code.includes('function setup()')) {
        errors.push('Missing required function: setup()');
    }

    if (!code.includes('function draw()')) {
        errors.push('Missing required function: draw()');
    }

    // Check for instance mode (not allowed)
    if (code.includes('new p5(')) {
        errors.push('Instance mode not allowed. Use global mode (setup/draw).');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Default starter template
 */
export const DEFAULT_TEMPLATE: SketchTemplate = {
    setup: `  createCanvas(800, 600);
  background(20);`,
    draw: `  // Draw colorful circles that follow the mouse
  fill(random(255), random(255), random(255), 150);
  noStroke();
  ellipse(mouseX, mouseY, 50, 50);`
};

/**
 * Blank template for starting from scratch
 */
export const BLANK_TEMPLATE: SketchTemplate = {
    setup: `  createCanvas(400, 400);
  background(220);`,
    draw: `  // Your code here`
};

/**
 * Example templates for common patterns
 */
export const EXAMPLE_TEMPLATES = {
    animation: {
        setup: `  createCanvas(400, 400);
  background(220);`,
        draw: `  background(220, 10); // Fade effect
  
  // Animated circle
  let x = width / 2 + cos(frameCount * 0.05) * 100;
  let y = height / 2 + sin(frameCount * 0.05) * 100;
  
  fill(100, 150, 255);
  ellipse(x, y, 50, 50);`
    },

    interactive: {
        setup: `  createCanvas(400, 400);
  background(220);`,
        draw: `  background(220);
  
  // Circle follows mouse
  fill(255, 100, 100);
  ellipse(mouseX, mouseY, 50, 50);`,
        events: `function mousePressed() {
  // Change background on click
  background(random(255), random(255), random(255));
}`
    },

    generative: {
        setup: `  createCanvas(400, 400);
  background(20);
  noLoop(); // Draw once`,
        draw: `  // Generative pattern
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(5, 30);
    
    fill(random(255), random(255), random(255), 150);
    noStroke();
    ellipse(x, y, size, size);
  }`
    },

    'rainbow-trail': {
        setup: `  createCanvas(windowWidth, windowHeight);
  background(20);
  colorMode(HSB);`,
        draw: `  // Rainbow trail effect
  let hue = (frameCount * 2) % 360;
  fill(hue, 80, 100, 0.3);
  noStroke();
  ellipse(mouseX, mouseY, 40, 40);`
    },

    'bouncing-ball': {
        setup: `  createCanvas(400, 400);
  background(220);`,
        draw: `  background(220);
  
  // Bouncing ball
  let x = width / 2 + cos(frameCount * 0.1) * 150;
  let y = height / 2 + abs(sin(frameCount * 0.15)) * 150;
  
  fill(100, 150, 255);
  ellipse(x, y, 50, 50);`
    }
};
