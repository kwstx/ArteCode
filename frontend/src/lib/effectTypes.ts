/**
 * Visual Effects Types
 * 
 * Type definitions for visual effects presets
 */

import type { Color } from './sceneModel';

export type EffectType = 'blur' | 'glow' | 'colorShift' | 'pixelate' | 'threshold' | 'invert';

export type EffectParameters =
    | { type: 'blur'; amount: number }
    | { type: 'glow'; intensity: number; color?: Color }
    | { type: 'colorShift'; hue: number; saturation: number }
    | { type: 'pixelate'; size: number }
    | { type: 'threshold'; level: number }
    | { type: 'invert' };

export interface VisualEffect {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    parameters: EffectParameters;
}

export interface SceneEffects {
    effects: VisualEffect[];
}
