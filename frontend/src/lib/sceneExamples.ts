/**
 * Example scenes demonstrating various element types and behaviors
 */

import type { Scene } from './sceneModel';

export const EXAMPLE_SCENES: Record<string, Scene> = {
    'colorful-circles': {
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
    },

    'bouncing-ball': {
        canvas: { width: 400, height: 400 },
        elements: [
            {
                id: 'bg-1',
                type: { kind: 'background', color: { mode: 'gray', value: 220 } },
                style: {},
                behavior: { kind: 'static' }
            },
            {
                id: 'ball-1',
                type: { kind: 'circle', x: 200, y: 200, diameter: 50 },
                style: {
                    fill: { mode: 'rgb', r: 100, g: 150, b: 255 }
                },
                behavior: {
                    kind: 'animated',
                    property: 'position',
                    function: { type: 'sin', speed: 0.1, amplitude: 150, offset: 0 }
                }
            }
        ]
    },

    'rainbow-trail': {
        canvas: { width: 800, height: 600 },
        colorMode: 'HSB',
        elements: [
            {
                id: 'bg-1',
                type: { kind: 'background', color: { mode: 'gray', value: 20 } },
                style: {},
                behavior: { kind: 'static' }
            },
            {
                id: 'circle-1',
                type: { kind: 'circle', x: 400, y: 300, diameter: 40 },
                style: {
                    fill: { mode: 'hsb', h: 180, s: 80, b: 100, a: 0.3 },
                    noStroke: true
                },
                behavior: { kind: 'followMouse', property: 'both' }
            }
        ]
    },

    'simple-shapes': {
        canvas: { width: 400, height: 400 },
        elements: [
            {
                id: 'bg-1',
                type: { kind: 'background', color: { mode: 'gray', value: 240 } },
                style: {},
                behavior: { kind: 'static' }
            },
            {
                id: 'circle-1',
                type: { kind: 'circle', x: 100, y: 100, diameter: 80 },
                style: {
                    fill: { mode: 'rgb', r: 255, g: 100, b: 100 },
                    stroke: { mode: 'gray', value: 0 },
                    strokeWeight: 2
                },
                behavior: { kind: 'static' }
            },
            {
                id: 'rect-1',
                type: { kind: 'rectangle', x: 200, y: 200, width: 100, height: 60 },
                style: {
                    fill: { mode: 'rgb', r: 100, g: 150, b: 255 },
                    stroke: { mode: 'gray', value: 0 },
                    strokeWeight: 2
                },
                behavior: { kind: 'static' }
            },
            {
                id: 'line-1',
                type: { kind: 'line', x1: 50, y1: 300, x2: 350, y2: 300 },
                style: {
                    stroke: { mode: 'gray', value: 0 },
                    strokeWeight: 3
                },
                behavior: { kind: 'static' }
            }
        ]
    },

    'interactive-circle': {
        canvas: { width: 400, height: 400 },
        elements: [
            {
                id: 'bg-1',
                type: { kind: 'background', color: { mode: 'gray', value: 220 } },
                style: {},
                behavior: { kind: 'static' }
            },
            {
                id: 'circle-1',
                type: { kind: 'circle', x: 200, y: 200, diameter: 50 },
                style: {
                    fill: { mode: 'rgb', r: 255, g: 100, b: 100 }
                },
                behavior: { kind: 'followMouse', property: 'both' }
            }
        ]
    }
};
