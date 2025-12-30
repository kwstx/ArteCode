/**
 * Low-Code Behavior Blocks
 * 
 * Simple, composable blocks that add dynamic behavior to visual elements.
 * Each block maps to a known p5.js pattern.
 */

import type { SceneElement, Color } from './sceneModel';

// ============================================
// BEHAVIOR BLOCK TYPES
// ============================================

/**
 * Motion blocks - add movement to elements
 */
export type MotionBlock =
    | { type: 'oscillate'; axis: 'x' | 'y'; speed: number; range: number }
    | { type: 'rotate'; speed: number }
    | { type: 'bounce'; axis: 'x' | 'y'; speed: number; min: number; max: number }
    | { type: 'circlePath'; radius: number; speed: number };

/**
 * Noise blocks - add organic variation
 */
export type NoiseBlock =
    | { type: 'perlinNoise'; axis: 'x' | 'y'; scale: number; speed: number }
    | { type: 'jitter'; amount: number };

/**
 * Color blocks - add color variation
 */
export type ColorBlock =
    | { type: 'pulse'; speed: number; minAlpha: number; maxAlpha: number }
    | { type: 'rainbow'; speed: number };

/**
 * Interaction blocks - add user interaction
 */
export type InteractionBlock =
    | { type: 'followMouse'; speed: number }
    | { type: 'clickToChange'; property: string; value: any };

/**
 * All behavior blocks
 */
export type BehaviorBlock = MotionBlock | NoiseBlock | ColorBlock | InteractionBlock;

// ============================================
// CODE GENERATION
// ============================================

/**
 * Generate code for a single behavior block
 */
export function generateBlockCode(block: BehaviorBlock, element: SceneElement): string[] {
    const lines: string[] = [];

    switch (block.type) {
        // Motion blocks
        case 'oscillate': {
            const axis = block.axis;
            const baseValue = element.type.kind === 'circle'
                ? (axis === 'x' ? element.type.x : element.type.y)
                : element.type.kind === 'rectangle'
                    ? (axis === 'x' ? element.type.x : element.type.y)
                    : 0;
            lines.push(
                `  let ${axis} = ${baseValue} + sin(frameCount * ${block.speed}) * ${block.range};`
            );
            break;
        }

        case 'rotate': {
            lines.push(`  push();`);
            lines.push(`  translate(width / 2, height / 2);`);
            lines.push(`  rotate(frameCount * ${block.speed});`);
            lines.push(`  translate(-width / 2, -height / 2);`);
            break;
        }

        case 'bounce': {
            const axis = block.axis;
            const range = block.max - block.min;
            lines.push(
                `  let ${axis} = ${block.min} + abs(sin(frameCount * ${block.speed})) * ${range};`
            );
            break;
        }

        case 'circlePath': {
            lines.push(
                `  let x = width / 2 + cos(frameCount * ${block.speed}) * ${block.radius};`
            );
            lines.push(
                `  let y = height / 2 + sin(frameCount * ${block.speed}) * ${block.radius};`
            );
            break;
        }

        // Noise blocks
        case 'perlinNoise': {
            const axis = block.axis;
            const baseValue = element.type.kind === 'circle'
                ? (axis === 'x' ? element.type.x : element.type.y)
                : element.type.kind === 'rectangle'
                    ? (axis === 'x' ? element.type.x : element.type.y)
                    : 0;
            lines.push(
                `  let ${axis} = ${baseValue} + noise(frameCount * ${block.speed}) * ${block.scale};`
            );
            break;
        }

        case 'jitter': {
            lines.push(`  let jitterX = random(-${block.amount}, ${block.amount});`);
            lines.push(`  let jitterY = random(-${block.amount}, ${block.amount});`);
            break;
        }

        // Color blocks
        case 'pulse': {
            lines.push(
                `  let alpha = map(sin(frameCount * ${block.speed}), -1, 1, ${block.minAlpha}, ${block.maxAlpha});`
            );
            break;
        }

        case 'rainbow': {
            lines.push(`  let hue = (frameCount * ${block.speed}) % 360;`);
            break;
        }

        // Interaction blocks
        case 'followMouse': {
            if (element.type.kind === 'circle' || element.type.kind === 'rectangle') {
                const x = element.type.x;
                const y = element.type.y;
                lines.push(`  let x = lerp(${x}, mouseX, ${block.speed});`);
                lines.push(`  let y = lerp(${y}, mouseY, ${block.speed});`);
            }
            break;
        }

        case 'clickToChange': {
            // This would be handled in event handlers
            break;
        }
    }

    return lines;
}

/**
 * Combine multiple blocks intelligently
 */
export function combineBlocks(blocks: BehaviorBlock[], element: SceneElement): string[] {
    const lines: string[] = [];
    const usedAxes = new Set<string>();

    // Sort blocks by priority (motion first, then noise, then color)
    const sortedBlocks = [...blocks].sort((a, b) => {
        const priority: Record<string, number> = {
            oscillate: 1,
            bounce: 1,
            circlePath: 1,
            rotate: 1,
            perlinNoise: 2,
            jitter: 3,
            pulse: 4,
            rainbow: 4,
            followMouse: 5,
            clickToChange: 6
        };
        return (priority[a.type] || 10) - (priority[b.type] || 10);
    });

    for (const block of sortedBlocks) {
        // Check for axis conflicts
        if ('axis' in block && block.axis) {
            if (usedAxes.has(block.axis)) {
                // Skip conflicting blocks
                continue;
            }
            usedAxes.add(block.axis);
        }

        lines.push(...generateBlockCode(block, element));
    }

    return lines;
}

// ============================================
// BLOCK PRESETS
// ============================================

/**
 * Predefined block configurations for common patterns
 */
export const BLOCK_PRESETS = {
    // Motion presets
    oscillateX: { type: 'oscillate', axis: 'x', speed: 0.05, range: 100 } as BehaviorBlock,
    oscillateY: { type: 'oscillate', axis: 'y', speed: 0.05, range: 100 } as BehaviorBlock,
    slowRotate: { type: 'rotate', speed: 0.01 } as BehaviorBlock,
    fastRotate: { type: 'rotate', speed: 0.05 } as BehaviorBlock,
    bounceX: { type: 'bounce', axis: 'x', speed: 0.05, min: 100, max: 700 } as BehaviorBlock,
    bounceY: { type: 'bounce', axis: 'y', speed: 0.05, min: 100, max: 500 } as BehaviorBlock,
    orbit: { type: 'circlePath', radius: 150, speed: 0.02 } as BehaviorBlock,

    // Noise presets
    noiseX: { type: 'perlinNoise', axis: 'x', scale: 100, speed: 0.01 } as BehaviorBlock,
    noiseY: { type: 'perlinNoise', axis: 'y', scale: 100, speed: 0.01 } as BehaviorBlock,
    shake: { type: 'jitter', amount: 5 } as BehaviorBlock,
    vibrate: { type: 'jitter', amount: 2 } as BehaviorBlock,

    // Color presets
    breathe: { type: 'pulse', speed: 0.05, minAlpha: 100, maxAlpha: 255 } as BehaviorBlock,
    fastPulse: { type: 'pulse', speed: 0.1, minAlpha: 50, maxAlpha: 255 } as BehaviorBlock,
    rainbowSlow: { type: 'rainbow', speed: 1 } as BehaviorBlock,
    rainbowFast: { type: 'rainbow', speed: 5 } as BehaviorBlock,

    // Interaction presets
    followSlow: { type: 'followMouse', speed: 0.05 } as BehaviorBlock,
    followFast: { type: 'followMouse', speed: 0.2 } as BehaviorBlock
};

/**
 * Block descriptions for UI
 */
export const BLOCK_DESCRIPTIONS = {
    oscillate: 'Moves element back and forth smoothly',
    rotate: 'Rotates element continuously',
    bounce: 'Bounces element between boundaries',
    circlePath: 'Moves element in a circular path',
    perlinNoise: 'Adds smooth, organic movement',
    jitter: 'Adds small random vibrations',
    pulse: 'Fades element in and out',
    rainbow: 'Cycles through rainbow colors',
    followMouse: 'Element follows the mouse cursor',
    clickToChange: 'Changes property when clicked'
};
