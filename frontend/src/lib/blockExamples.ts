/**
 * Example scenes demonstrating behavior blocks
 */

import type { Scene } from './sceneModel';
import { BLOCK_PRESETS } from './behaviorBlocks';

export const BLOCK_EXAMPLE_SCENES: Record<string, Scene> = {
    'oscillating-circle': {
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
                    fill: { mode: 'rgb', r: 100, g: 150, b: 255 },
                    noStroke: true
                },
                behavior: { kind: 'static' },
                blocks: [BLOCK_PRESETS.oscillateX]
            }
        ]
    },

    'pulsing-circle': {
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
                    fill: { mode: 'rgb', r: 255, g: 100, b: 100 },
                    noStroke: true
                },
                behavior: { kind: 'static' },
                blocks: [BLOCK_PRESETS.breathe]
            }
        ]
    },

    'oscillate-and-pulse': {
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
                    fill: { mode: 'rgb', r: 255, g: 150, b: 100 },
                    noStroke: true
                },
                behavior: { kind: 'static' },
                blocks: [BLOCK_PRESETS.oscillateX, BLOCK_PRESETS.breathe]
            }
        ]
    },

    'orbiting-circle': {
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
                type: { kind: 'circle', x: 400, y: 300, diameter: 30 },
                style: {
                    fill: { mode: 'rgb', r: 100, g: 255, b: 150 },
                    noStroke: true
                },
                behavior: { kind: 'static' },
                blocks: [BLOCK_PRESETS.orbit]
            }
        ]
    },

    'rainbow-circle': {
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
                type: { kind: 'circle', x: 400, y: 300, diameter: 100 },
                style: {
                    fill: { mode: 'hsb', h: 180, s: 80, b: 100 },
                    noStroke: true
                },
                behavior: { kind: 'static' },
                blocks: [BLOCK_PRESETS.rainbowSlow]
            }
        ]
    }
};
