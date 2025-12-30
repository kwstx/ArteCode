/**
 * Sketch Description Generator
 * 
 * Converts sketch shapes into natural language descriptions for AI
 */

import type { SketchData, SketchShape } from './sketchTypes';

/**
 * Generate natural language description from sketch data
 */
export function generateDescription(sketch: SketchData): string {
    if (sketch.shapes.length === 0) {
        return 'Create a blank p5.js sketch with a light gray background';
    }

    const descriptions: string[] = [];

    for (const shape of sketch.shapes) {
        descriptions.push(describeShape(shape));
    }

    const shapeList = descriptions.join(', ');
    return `Create a p5.js sketch on a canvas of ${sketch.canvasWidth}x${sketch.canvasHeight} with ${shapeList}. Use a light gray background and make the shapes colorful.`;
}

/**
 * Describe a single shape in natural language
 */
function describeShape(shape: SketchShape): string {
    switch (shape.type) {
        case 'circle':
            return `a circle centered at position (${Math.round(shape.x)}, ${Math.round(shape.y)}) with radius ${Math.round(shape.radius)}`;

        case 'rectangle':
            return `a rectangle at position (${Math.round(shape.x)}, ${Math.round(shape.y)}) with width ${Math.round(Math.abs(shape.width))} and height ${Math.round(Math.abs(shape.height))}`;

        case 'line':
            return `a line from point (${Math.round(shape.x1)}, ${Math.round(shape.y1)}) to point (${Math.round(shape.x2)}, ${Math.round(shape.y2)})`;
    }
}

/**
 * Get a human-readable summary of the sketch
 */
export function getSketchSummary(sketch: SketchData): string {
    const counts = {
        circle: 0,
        rectangle: 0,
        line: 0
    };

    for (const shape of sketch.shapes) {
        counts[shape.type]++;
    }

    const parts: string[] = [];
    if (counts.circle > 0) parts.push(`${counts.circle} circle${counts.circle > 1 ? 's' : ''}`);
    if (counts.rectangle > 0)
        parts.push(`${counts.rectangle} rectangle${counts.rectangle > 1 ? 's' : ''}`);
    if (counts.line > 0) parts.push(`${counts.line} line${counts.line > 1 ? 's' : ''}`);

    return parts.length > 0 ? parts.join(', ') : 'empty sketch';
}
