/**
 * Sketch-to-Code Types
 * 
 * Type definitions for sketch input and shape detection
 */

export type SketchShape =
    | { type: 'circle'; x: number; y: number; radius: number; color?: string }
    | { type: 'rectangle'; x: number; y: number; width: number; height: number; color?: string }
    | { type: 'line'; x1: number; y1: number; x2: number; y2: number; color?: string };

export interface SketchData {
    shapes: SketchShape[];
    canvasWidth: number;
    canvasHeight: number;
}

export type DrawingTool = 'circle' | 'rectangle' | 'line';
