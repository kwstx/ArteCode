<script lang="ts">
	import type { Color } from '$lib/sceneModel';

	interface Props {
		color: Color;
		onchange: (color: Color) => void;
	}

	let { color, onchange }: Props = $props();

	// Convert color to RGB for display
	let r = $state(color.mode === 'rgb' ? color.r : 128);
	let g = $state(color.mode === 'rgb' ? color.g : 128);
	let b = $state(color.mode === 'rgb' ? color.b : 128);
	let a = $state(color.mode === 'rgb' && color.a !== undefined ? color.a : 255);

	function updateColor() {
		onchange({
			mode: 'rgb',
			r,
			g,
			b,
			a: a < 255 ? a : undefined
		});
	}

	function handleRChange(value: number) {
		r = value;
		updateColor();
	}

	function handleGChange(value: number) {
		g = value;
		updateColor();
	}

	function handleBChange(value: number) {
		b = value;
		updateColor();
	}

	function handleAChange(value: number) {
		a = value;
		updateColor();
	}

	// Preview color
	let previewColor = $derived(`rgba(${r}, ${g}, ${b}, ${a / 255})`);
</script>

<div class="color-picker">
	<div class="color-preview" style="background: {previewColor}"></div>

	<div class="sliders">
		<div class="color-slider">
			<label>
				<span>R</span>
				<span class="value">{r}</span>
			</label>
			<input
				type="range"
				min="0"
				max="255"
				value={r}
				oninput={(e) => handleRChange(Number(e.currentTarget.value))}
				class="slider red"
			/>
		</div>

		<div class="color-slider">
			<label>
				<span>G</span>
				<span class="value">{g}</span>
			</label>
			<input
				type="range"
				min="0"
				max="255"
				value={g}
				oninput={(e) => handleGChange(Number(e.currentTarget.value))}
				class="slider green"
			/>
		</div>

		<div class="color-slider">
			<label>
				<span>B</span>
				<span class="value">{b}</span>
			</label>
			<input
				type="range"
				min="0"
				max="255"
				value={b}
				oninput={(e) => handleBChange(Number(e.currentTarget.value))}
				class="slider blue"
			/>
		</div>

		<div class="color-slider">
			<label>
				<span>Alpha</span>
				<span class="value">{a}</span>
			</label>
			<input
				type="range"
				min="0"
				max="255"
				value={a}
				oninput={(e) => handleAChange(Number(e.currentTarget.value))}
				class="slider alpha"
			/>
		</div>
	</div>
</div>

<style>
	.color-picker {
		display: flex;
		gap: 1rem;
		padding: 0.75rem;
		background: #f5f5f5;
		border-radius: 6px;
	}

	.color-preview {
		width: 60px;
		height: 60px;
		border-radius: 4px;
		border: 2px solid #ddd;
		flex-shrink: 0;
	}

	.sliders {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.color-slider {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	label {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		font-weight: 500;
		color: #666;
	}

	.value {
		font-family: monospace;
		color: #999;
	}

	.slider {
		width: 100%;
		height: 4px;
		border-radius: 2px;
		outline: none;
		-webkit-appearance: none;
	}

	.slider.red {
		background: linear-gradient(to right, #000, #ff0000);
	}

	.slider.green {
		background: linear-gradient(to right, #000, #00ff00);
	}

	.slider.blue {
		background: linear-gradient(to right, #000, #0000ff);
	}

	.slider.alpha {
		background: linear-gradient(to right, transparent, #000);
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid #333;
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid #333;
		cursor: pointer;
	}
</style>
