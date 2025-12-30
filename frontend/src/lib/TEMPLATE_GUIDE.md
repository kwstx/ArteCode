# p5.js Code Template System

## Overview

The ArteCode toolkit uses a **single, strict code template structure** for all p5.js sketches. This ensures consistency across all code generation methods (visual editor, low-code blocks, AI) and makes code predictable, debuggable, and beginner-friendly.

## Template Structure

Every p5.js sketch follows this canonical structure:

```javascript
// ============================================
// PRELOAD (Optional)
// ============================================
function preload() {
  // Load assets before setup runs
}

// ============================================
// SETUP (Required)
// ============================================
function setup() {
  // Runs once at the start
  createCanvas(400, 400);
}

// ============================================
// DRAW (Required)
// ============================================
function draw() {
  // Runs continuously (60fps by default)
}

// ============================================
// HELPER FUNCTIONS (Optional)
// ============================================
function myHelper() {
  // Custom functions
}

// ============================================
// EVENT HANDLERS (Optional)
// ============================================
function mousePressed() {
  // Mouse and keyboard events
}
```

## Rules

### Required
- ✅ `setup()` function MUST be present
- ✅ `draw()` function MUST be present

### Optional
- `preload()` - For loading assets (images, fonts, sounds)
- Helper functions - Custom utility functions
- Event handlers - Mouse/keyboard interaction

### Ordering
1. `preload()` (if present)
2. `setup()` (required)
3. `draw()` (required)
4. Helper functions (if present)
5. Event handlers (if present)

### Restrictions
- ❌ Instance mode (`new p5(...)`) is NOT allowed
- ✅ Only global mode (setup/draw) is permitted

## Usage

### Generating Code from Template

```typescript
import { generateSketch, type SketchTemplate } from '$lib/codeTemplate';

const myTemplate: SketchTemplate = {
  setup: `  createCanvas(400, 400);
  background(220);`,
  draw: `  fill(255, 0, 0);
  ellipse(mouseX, mouseY, 50, 50);`
};

const code = generateSketch(myTemplate);
```

### Using Predefined Templates

```typescript
import { generateSketch, DEFAULT_TEMPLATE, BLANK_TEMPLATE, EXAMPLE_TEMPLATES } from '$lib/codeTemplate';

// Default colorful circles
const defaultCode = generateSketch(DEFAULT_TEMPLATE);

// Blank starter
const blankCode = generateSketch(BLANK_TEMPLATE);

// Animation example
const animationCode = generateSketch(EXAMPLE_TEMPLATES.animation);

// Interactive example
const interactiveCode = generateSketch(EXAMPLE_TEMPLATES.interactive);

// Generative art example
const generativeCode = generateSketch(EXAMPLE_TEMPLATES.generative);
```

### Validating Code

```typescript
import { validateSketch } from '$lib/codeTemplate';

const validation = validateSketch(userCode);

if (!validation.valid) {
  console.error('Invalid sketch:', validation.errors);
  // Show errors to user
} else {
  // Code is valid
}
```

## Available Templates

### `DEFAULT_TEMPLATE`
Colorful circles that follow the mouse - great for demonstrating instant reload.

### `BLANK_TEMPLATE`
Minimal starter template with empty draw function.

### `EXAMPLE_TEMPLATES.animation`
Animated circle moving in a circular path with fade effect.

### `EXAMPLE_TEMPLATES.interactive`
Circle follows mouse, click to change background color.

### `EXAMPLE_TEMPLATES.generative`
Generative art pattern with random circles (draws once).

### `EXAMPLE_TEMPLATES['rainbow-trail']`
Rainbow-colored trail effect using HSB color mode.

### `EXAMPLE_TEMPLATES['bouncing-ball']`
Bouncing ball animation using trigonometric functions.

## Creating Custom Templates

```typescript
import type { SketchTemplate } from '$lib/codeTemplate';

const myCustomTemplate: SketchTemplate = {
  // Optional: preload assets
  preload: `  myImage = loadImage('path/to/image.jpg');`,
  
  // Required: setup
  setup: `  createCanvas(800, 600);
  background(0);
  frameRate(30);`,
  
  // Required: draw
  draw: `  background(0, 10); // Fade effect
  
  // Your animation code
  fill(255);
  ellipse(width/2, height/2, 100, 100);`,
  
  // Optional: helper functions
  helpers: `function drawStar(x, y, radius) {
  // Star drawing logic
}`,
  
  // Optional: event handlers
  events: `function mousePressed() {
  // Handle mouse click
}

function keyPressed() {
  // Handle key press
}`
};
```

## Integration with Future Features

### Visual Editor
- Visual blocks will generate code snippets for each section
- Blocks snap into predefined sections (setup, draw, helpers, events)
- Generated code always follows template structure

### Low-Code Blocks
- Each block type knows which section it belongs to
- Combining blocks produces valid template-compliant code

### AI Code Generation
- AI prompts include template specification
- AI responses are validated against template rules
- Non-compliant code is automatically reformatted

## Benefits

1. **Predictability** - Every sketch has the same structure
2. **Learnability** - Beginners see consistent patterns
3. **Debuggability** - Errors are easier to locate in known sections
4. **AI-Friendly** - AI can reliably generate and modify code
5. **Tooling** - Easier to build visual editors and code generators

## Why Global Mode?

We chose global mode over instance mode because:

- ✅ Matches official p5.js tutorials and documentation
- ✅ Easier for beginners (no callbacks, no `p.` prefix)
- ✅ More concise and readable
- ✅ Standard in creative coding education
- ✅ Works perfectly with our runtime

## Example: Full Sketch

```javascript
// ============================================
// SETUP
// ============================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(20);
  colorMode(HSB);
}

// ============================================
// DRAW
// ============================================
function draw() {
  // Rainbow trail effect
  let hue = (frameCount * 2) % 360;
  fill(hue, 80, 100, 0.3);
  noStroke();
  ellipse(mouseX, mouseY, 40, 40);
}

// ============================================
// EVENT HANDLERS
// ============================================
function mousePressed() {
  background(20);
}
```

This structure is enforced everywhere in ArteCode to ensure consistency and predictability.
