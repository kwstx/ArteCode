<script lang="ts">
	import type { VisualEffect } from '$lib/effectTypes';
	import { getEffectRange } from '$lib/effectPresets';
	import Slider from './Slider.svelte';

	interface Props {
		effects: VisualEffect[];
		onUpdate: (effects: VisualEffect[]) => void;
	}

	let { effects, onUpdate }: Props = $props();

	function toggleEffect(id: string) {
		const updated = effects.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e));
		onUpdate(updated);
	}

	function updateParameter(id: string, param: string, value: number) {
		const updated = effects.map((e) => {
			if (e.id === id) {
				return {
					...e,
					parameters: { ...e.parameters, [param]: value }
				};
			}
			return e;
		});
		onUpdate(updated);
	}
</script>

<div class="effects-panel">
	<h3>🎨 Visual Effects</h3>
	<p class="hint">Add visual effects to your sketch with simple controls</p>

	<div class="effects-list">
		{#each effects as effect}
			<div class="effect" class:enabled={effect.enabled}>
				<label class="effect-header">
					<input
						type="checkbox"
						checked={effect.enabled}
						onchange={() => toggleEffect(effect.id)}
					/>
					<div class="effect-info">
						<strong>{effect.name}</strong>
						<span class="description">{effect.description}</span>
					</div>
				</label>

				{#if effect.enabled}
					<div class="controls">
						{#if effect.parameters.type === 'blur'}
							<Slider
								label="Amount"
								value={effect.parameters.amount}
								min={getEffectRange('blur', 'amount').min}
								max={getEffectRange('blur', 'amount').max}
								step={getEffectRange('blur', 'amount').step}
								onchange={(v) => updateParameter(effect.id, 'amount', v)}
							/>
						{:else if effect.parameters.type === 'glow'}
							<Slider
								label="Intensity"
								value={effect.parameters.intensity}
								min={getEffectRange('glow', 'intensity').min}
								max={getEffectRange('glow', 'intensity').max}
								step={getEffectRange('glow', 'intensity').step}
								onchange={(v) => updateParameter(effect.id, 'intensity', v)}
							/>
						{:else if effect.parameters.type === 'colorShift'}
							<Slider
								label="Hue Shift"
								value={effect.parameters.hue}
								min={getEffectRange('colorShift', 'hue').min}
								max={getEffectRange('colorShift', 'hue').max}
								step={getEffectRange('colorShift', 'hue').step}
								onchange={(v) => updateParameter(effect.id, 'hue', v)}
							/>
							<Slider
								label="Saturation"
								value={effect.parameters.saturation}
								min={getEffectRange('colorShift', 'saturation').min}
								max={getEffectRange('colorShift', 'saturation').max}
								step={getEffectRange('colorShift', 'saturation').step}
								onchange={(v) => updateParameter(effect.id, 'saturation', v)}
							/>
						{:else if effect.parameters.type === 'pixelate'}
							<Slider
								label="Pixel Size"
								value={effect.parameters.size}
								min={getEffectRange('pixelate', 'size').min}
								max={getEffectRange('pixelate', 'size').max}
								step={getEffectRange('pixelate', 'size').step}
								onchange={(v) => updateParameter(effect.id, 'size', v)}
							/>
						{:else if effect.parameters.type === 'threshold'}
							<Slider
								label="Threshold Level"
								value={effect.parameters.level}
								min={getEffectRange('threshold', 'level').min}
								max={getEffectRange('threshold', 'level').max}
								step={getEffectRange('threshold', 'level').step}
								onchange={(v) => updateParameter(effect.id, 'level', v)}
							/>
						{:else if effect.parameters.type === 'invert'}
							<p class="toggle-only">Toggle to invert all colors</p>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.effects-panel {
		padding: 1.5rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.3rem;
		color: #333;
	}

	.hint {
		margin: 0 0 1rem 0;
		color: #666;
		font-size: 0.9rem;
	}

	.effects-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.effect {
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		padding: 1rem;
		transition: all 0.2s;
	}

	.effect.enabled {
		border-color: #0066ff;
		background: #f0f7ff;
	}

	.effect-header {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		cursor: pointer;
		margin-bottom: 0;
	}

	.effect-header input[type='checkbox'] {
		margin-top: 0.25rem;
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.effect-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.effect-info strong {
		font-size: 1rem;
		color: #333;
	}

	.description {
		font-size: 0.85rem;
		color: #666;
	}

	.controls {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #e0e0e0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.toggle-only {
		margin: 0;
		color: #666;
		font-size: 0.9rem;
		font-style: italic;
	}
</style>
