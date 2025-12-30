/**
 * Visual Scene Model
 * 
 * Represents everything on the canvas as structured data.
 * This is the source of truth for the visual editor.
 */

import { generateSketch, type SketchTemplate } from './codeTemplate';
import type { BehaviorBlock } from './behaviorBlocks';

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Color representation supporting RGB, HSB, and grayscale
 */
export type Color =
    | { mode: 'rgb'; r: number; g: number; b: number; a?: number }
    | { mode: 'hsb'; h: number; s: number; b: number; a?: number }
    | { mode: 'gray'; value: number; a?: number };

/**
 * Element style properties
 */
export interface ElementStyle {
    fill?: Color;
    stroke?: Color;
    strokeWeight?: number;
    noFill?: boolean;
    noStroke?: boolean;
}

/**
 * Animation function types
 */
export type AnimationFunction =
    | { type: 'sin'; speed: number; amplitude: number; offset: number }
    | { type: 'cos'; speed: number; amplitude: number; offset: number }
    | { type: 'linear'; speed: number };

/**
 * Element behavior types
 */
export type ElementBehavior =
    | { kind: 'static' }
    | { kind: 'followMouse'; property: 'x' | 'y' | 'both' }
    | { kind: 'animated'; property: string; function: AnimationFunction }
    | { kind: 'random'; property: string; min: number; max: number };

/**
 * Visual element types
 */
export type ElementType =
    | { kind: 'circle'; x: number; y: number; diameter: number }
    | { kind: 'rectangle'; x: number; y: number; width: number; height: number }
    | { kind: 'line'; x1: number; y1: number; x2: number; y2: number }
    | { kind: 'text'; content: string; x: number; y: number; size: number }
    | { kind: 'background'; color: Color };

/**
 * Scene element - a visual object on the canvas
 */
export interface SceneElement {
    id: string;
    type: ElementType;
    style: ElementStyle;
    behavior: ElementBehavior;
    blocks?: BehaviorBlock[]; // NEW: Composable behavior blocks
}

/**
 * Complete scene representation
 */
export interface Scene {
    canvas: {
        width: number;
        height: number;
    };
    colorMode?: 'RGB' | 'HSB';
    frameRate?: number;
    elements: SceneElement[];
    effects?: VisualEffect[]; // NEW: Visual effects
}

// Import visual effects types
import type { VisualEffect } from './effectTypes';

// ============================================
// SCENE MANIPULATION
// ============================================

/**
 * Create a new blank scene
 */
export function createScene(width: number, height: number): Scene {
    return {
        canvas: { width, height },
        elements: []
    };
}

/**
 * Add an element to the scene
 */
export function addElement(scene: Scene, element: SceneElement): Scene {
    return {
        ...scene,
        elements: [...scene.elements, element]
    };
}

/**
 * Remove an element from the scene
 */
export function removeElement(scene: Scene, id: string): Scene {
    return {
        ...scene,
        elements: scene.elements.filter((el) => el.id !== id)
    };
}

/**
 * Update an element in the scene
 */
export function updateElement(
    scene: Scene,
    id: string,
    updates: Partial<SceneElement>
): Scene {
    return {
        ...scene,
        elements: scene.elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    };
}

// ============================================
// CODE GENERATION
// ============================================

/**
 * Convert a color to p5.js code
 */
function colorToCode(color: Color): string {
    switch (color.mode) {
        case 'rgb':
            return color.a !== undefined
                ? `${color.r}, ${color.g}, ${color.b}, ${color.a}`
                : `${color.r}, ${color.g}, ${color.b}`;
        case 'hsb':
            return color.a !== undefined
                ? `${color.h}, ${color.s}, ${color.b}, ${color.a}`
                : `${color.h}, ${color.s}, ${color.b}`;
        case 'gray':
            return color.a !== undefined ? `${color.value}, ${color.a}` : `${color.value}`;
    }
}

/**
 * Generate style code for an element
 */
function generateStyleCode(style: ElementStyle): string[] {
    const lines: string[] = [];

    if (style.noFill) {
        lines.push('  noFill();');
    } else if (style.fill) {
        lines.push(`  fill(${colorToCode(style.fill)});`);
    }

    if (style.noStroke) {
        lines.push('  noStroke();');
    } else if (style.stroke) {
        lines.push(`  stroke(${colorToCode(style.stroke)});`);
        if (style.strokeWeight !== undefined) {
            lines.push(`  strokeWeight(${style.strokeWeight});`);
        }
    }

    return lines;
}

/**
 * Generate code for an element's position based on behavior
 */
function generatePositionCode(element: SceneElement): { vars: string[]; x: string; y: string } {
    const vars: string[] = [];
    let x: string;
    let y: string;

    if (element.behavior.kind === 'followMouse') {
        if (element.type.kind === 'circle') {
            x = element.behavior.property === 'x' || element.behavior.property === 'both'
                ? 'mouseX'
                : element.type.x.toString();
            y = element.behavior.property === 'y' || element.behavior.property === 'both'
                ? 'mouseY'
                : element.type.y.toString();
        } else if (element.type.kind === 'rectangle') {
            x = element.behavior.property === 'x' || element.behavior.property === 'both'
                ? 'mouseX'
                : element.type.x.toString();
            y = element.behavior.property === 'y' || element.behavior.property === 'both'
                ? 'mouseY'
                : element.type.y.toString();
        } else {
            x = 'mouseX';
            y = 'mouseY';
        }
    } else if (element.behavior.kind === 'animated' && element.type.kind === 'circle') {
        const anim = element.behavior.function;
        if (anim.type === 'sin' || anim.type === 'cos') {
            const func = anim.type;
            vars.push(
                `  let x = width / 2 + ${func}(frameCount * ${anim.speed}) * ${anim.amplitude};`
            );
            vars.push(`  let y = height / 2 + ${anim.offset};`);
            x = 'x';
            y = 'y';
        } else {
            x = element.type.x.toString();
            y = element.type.y.toString();
        }
    } else if (element.type.kind === 'circle') {
        x = element.type.x.toString();
        y = element.type.y.toString();
    } else if (element.type.kind === 'rectangle') {
        x = element.type.x.toString();
        y = element.type.y.toString();
    } else {
        x = '0';
        y = '0';
    }

    return { vars, x, y };
}

/**
 * Generate code for a single element
 */
function generateElementCode(element: SceneElement): string[] {
    const lines: string[] = [];

    // Background is special - no style
    if (element.type.kind === 'background') {
        lines.push(`  background(${colorToCode(element.type.color)});`);
        return lines;
    }

    // Add style code
    lines.push(...generateStyleCode(element.style));

    // Generate element-specific code
    switch (element.type.kind) {
        case 'circle': {
            const pos = generatePositionCode(element);
            lines.push(...pos.vars);
            lines.push(`  ellipse(${pos.x}, ${pos.y}, ${element.type.diameter}, ${element.type.diameter});`);
            break;
        }
        case 'rectangle': {
            const pos = generatePositionCode(element);
            lines.push(...pos.vars);
            lines.push(`  rect(${pos.x}, ${pos.y}, ${element.type.width}, ${element.type.height});`);
            break;
        }
        case 'line':
            lines.push(`  line(${element.type.x1}, ${element.type.y1}, ${element.type.x2}, ${element.type.y2});`);
            break;
        case 'text':
            lines.push(`  textSize(${element.type.size});`);
            lines.push(`  text("${element.type.content}", ${element.type.x}, ${element.type.y});`);
            break;
    }

    return lines;
}

/**
 * Generate setup code from scene
 */
function generateSetup(scene: Scene): string {
    const lines: string[] = [];

    lines.push(`  createCanvas(${scene.canvas.width}, ${scene.canvas.height});`);

    if (scene.colorMode) {
        lines.push(`  colorMode(${scene.colorMode});`);
    }

    if (scene.frameRate) {
        lines.push(`  frameRate(${scene.frameRate});`);
    }

    // Add any static background
    const bgElement = scene.elements.find(
        (el) => el.type.kind === 'background' && el.behavior.kind === 'static'
    );
    if (bgElement && bgElement.type.kind === 'background') {
        lines.push(`  background(${colorToCode(bgElement.type.color)});`);
    }

    return lines.join('\n');
}

/**
 * Generate draw code from scene
 */
function generateDraw(scene: Scene): string {
    const lines: string[] = [];

    // Add dynamic background (in draw loop)
    const dynamicBg = scene.elements.find(
        (el) => el.type.kind === 'background' && el.behavior.kind !== 'static'
    );
    if (dynamicBg) {
        lines.push(...generateElementCode(dynamicBg));
    }

    // Add all other elements
    for (const element of scene.elements) {
        if (element.type.kind !== 'background') {
            // Generate behavior block code first
            if (element.blocks && element.blocks.length > 0) {
                // Import combineBlocks dynamically to avoid circular dependency
                const { combineBlocks } = require('./behaviorBlocks');
                const blockCode = combineBlocks(element.blocks, element);
                lines.push(...blockCode);
            }

            // Then generate element code
            lines.push(...generateElementCode(element));
        }
    }

    // Add visual effects at the end
    if (scene.effects && scene.effects.length > 0) {
        const { generateEffectsCode } = require('./effectPresets');
        const effectsCode = generateEffectsCode(scene.effects);
        if (effectsCode.length > 0) {
            lines.push('');
            lines.push(...effectsCode);
        }
    }

    return lines.join('\n');
}

/**
 * Convert scene to p5.js code
 */
export function sceneToCode(scene: Scene): string {
    const template: SketchTemplate = {
        setup: generateSetup(scene),
        draw: generateDraw(scene)
    };

    return generateSketch(template);
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate a scene
 */
export function validateScene(scene: Scene): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (scene.canvas.width <= 0 || scene.canvas.height <= 0) {
        errors.push('Canvas dimensions must be positive');
    }

    // Validate each element
    for (const element of scene.elements) {
        if (!element.id) {
            errors.push('Element missing ID');
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// ============================================
// PREDEFINED SCENES
// ============================================

/**
 * Default scene - colorful circles following mouse
 */
export const DEFAULT_SCENE: Scene = {
    canvas: { width: 800, height: 600 },
    elements: [
        {
            id: 'bg-1',
            type: { kind: 'background', color: { mode: 'gray', value: 20 } },
            style: {},
            behavior: { kind: 'static' }
        },
        {
            id: 'circle-1',
            type: { kind: 'circle', x: 400, y: 300, diameter: 50 },
            style: {
                fill: { mode: 'rgb', r: 255, g: 100, b: 100, a: 150 },
                noStroke: true
            },
            behavior: { kind: 'followMouse', property: 'both' }
        }
    ]
};

/**
 * Blank scene
 */
export const BLANK_SCENE: Scene = {
    canvas: { width: 400, height: 400 },
    elements: [
        {
            id: 'bg-1',
            type: { kind: 'background', color: { mode: 'gray', value: 220 } },
            style: {},
            behavior: { kind: 'static' }
        }
    ]
};
