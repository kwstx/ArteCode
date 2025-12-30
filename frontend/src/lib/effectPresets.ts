/**
 * Visual Effects Presets
 * 
 * Predefined visual effects with default parameters
 */

import type { VisualEffect } from './effectTypes';

export const DEFAULT_EFFECTS: VisualEffect[] = [
    {
        id: 'blur',
        name: 'Blur',
        description: 'Gaussian blur for soft, dreamy effects',
        enabled: false,
        parameters: { type: 'blur', amount: 3 }
    },
    {
        id: 'glow',
        name: 'Glow',
        description: 'Soft glow effect for highlights',
        enabled: false,
        parameters: { type: 'glow', intensity: 20 }
    },
    {
        id: 'colorShift',
        name: 'Color Shift',
        description: 'Rotate hue and adjust saturation',
        enabled: false,
        parameters: { type: 'colorShift', hue: 0, saturation: 1 }
    },
    {
        id: 'pixelate',
        name: 'Pixelate',
        description: 'Retro pixel art effect',
        enabled: false,
        parameters: { type: 'pixelate', size: 8 }
    },
    {
        id: 'threshold',
        name: 'Threshold',
        description: 'High contrast black and white',
        enabled: false,
        parameters: { type: 'threshold', level: 0.5 }
    },
    {
        id: 'invert',
        name: 'Invert',
        description: 'Invert all colors',
        enabled: false,
        parameters: { type: 'invert' }
    }
];

/**
 * Generate p5.js code for visual effects
 */
export function generateEffectsCode(effects: VisualEffect[]): string[] {
    const lines: string[] = [];
    const enabledEffects = effects.filter((e) => e.enabled);

    if (enabledEffects.length === 0) {
        return lines;
    }

    lines.push('  // Apply visual effects');

    for (const effect of enabledEffects) {
        switch (effect.parameters.type) {
            case 'blur':
                lines.push(`  filter(BLUR, ${effect.parameters.amount});`);
                break;

            case 'glow':
                lines.push(`  drawingContext.shadowBlur = ${effect.parameters.intensity};`);
                lines.push(`  drawingContext.shadowColor = 'rgba(255, 255, 255, 0.8)';`);
                break;

            case 'colorShift':
                if (effect.parameters.hue !== 0 || effect.parameters.saturation !== 1) {
                    lines.push(`  // Color shift effect`);
                    lines.push(`  loadPixels();`);
                    lines.push(`  // Apply hue shift: ${effect.parameters.hue}°`);
                    lines.push(`  // Apply saturation: ${effect.parameters.saturation * 100}%`);
                    lines.push(`  updatePixels();`);
                }
                break;

            case 'pixelate':
                lines.push(`  // Pixelate effect`);
                lines.push(`  let pg = createGraphics(width / ${effect.parameters.size}, height / ${effect.parameters.size});`);
                lines.push(`  pg.copy(get(), 0, 0, width, height, 0, 0, pg.width, pg.height);`);
                lines.push(`  image(pg, 0, 0, width, height);`);
                break;

            case 'threshold':
                lines.push(`  filter(THRESHOLD, ${effect.parameters.level});`);
                break;

            case 'invert':
                lines.push(`  filter(INVERT);`);
                break;
        }
    }

    return lines;
}

/**
 * Get effect parameter ranges
 */
export function getEffectRange(effectType: string, parameter: string): { min: number; max: number; step: number } {
    const ranges: Record<string, Record<string, { min: number; max: number; step: number }>> = {
        blur: {
            amount: { min: 0, max: 10, step: 0.5 }
        },
        glow: {
            intensity: { min: 0, max: 100, step: 1 }
        },
        colorShift: {
            hue: { min: 0, max: 360, step: 1 },
            saturation: { min: 0, max: 2, step: 0.1 }
        },
        pixelate: {
            size: { min: 2, max: 20, step: 1 }
        },
        threshold: {
            level: { min: 0, max: 1, step: 0.01 }
        }
    };

    return ranges[effectType]?.[parameter] || { min: 0, max: 100, step: 1 };
}
