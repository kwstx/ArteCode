<script lang="ts">
	interface Props {
		label: string;
		value: number;
		min: number;
		max: number;
		step?: number;
		onchange: (value: number) => void;
	}

	let { label, value, min, max, step = 1, onchange }: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		onchange(Number(target.value));
	}
</script>

<div class="slider-control">
	<label>
		<span class="label-text">{label}</span>
		<span class="value-display">{value}</span>
	</label>
	<input type="range" {min} {max} {step} {value} oninput={handleInput} class="slider" />
</div>

<style>
	.slider-control {
		margin-bottom: 1rem;
	}

	label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
		font-size: 0.85rem;
	}

	.label-text {
		font-weight: 500;
		color: #333;
	}

	.value-display {
		color: #666;
		font-family: monospace;
		font-size: 0.9rem;
	}

	.slider {
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: #e0e0e0;
		outline: none;
		-webkit-appearance: none;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #0066ff;
		cursor: pointer;
		transition: background 0.15s;
	}

	.slider::-webkit-slider-thumb:hover {
		background: #0052cc;
	}

	.slider::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #0066ff;
		cursor: pointer;
		border: none;
		transition: background 0.15s;
	}

	.slider::-moz-range-thumb:hover {
		background: #0052cc;
	}
</style>
