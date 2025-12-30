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
		margin-bottom: 1.25rem;
	}

	label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
		font-size: 0.75rem;
	}

	.label-text {
		font-weight: 700;
		color: #000000;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.value-display {
		color: #000000;
		font-family: 'Space Grotesk', monospace;
		font-size: 0.875rem;
		font-weight: 700;
		background: #000000;
		color: #ffffff;
		padding: 0.25rem 0.5rem;
		border-radius: 0;
	}

	.slider {
		width: 100%;
		height: 8px;
		border-radius: 0;
		background: #e5e5e5;
		outline: none;
		-webkit-appearance: none;
		border: 2px solid #000000;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 0;
		background: #000000;
		cursor: pointer;
		transition: background 0.1s;
		border: 2px solid #000000;
	}

	.slider::-webkit-slider-thumb:hover {
		background: #ffffff;
		border: 2px solid #000000;
	}

	.slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 0;
		background: #000000;
		cursor: pointer;
		border: 2px solid #000000;
		transition: background 0.1s;
	}

	.slider::-moz-range-thumb:hover {
		background: #ffffff;
	}
</style>
