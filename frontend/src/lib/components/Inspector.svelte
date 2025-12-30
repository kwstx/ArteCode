<script lang="ts">
	import type { SceneElement } from '$lib/sceneModel';
	import Slider from './Slider.svelte';
	import ColorPicker from './ColorPicker.svelte';

	interface Props {
		element: SceneElement | null;
		onUpdate: (updates: Partial<SceneElement>) => void;
	}

	let { element, onUpdate }: Props = $props();
</script>

<div class="inspector">
	{#if element}
		<div class="inspector-content">
			<h3 class="inspector-title">PROPERTIES</h3>

			{#if element.type.kind === 'circle'}
				<section class="property-section">
					<h4 class="section-title">POSITION</h4>
					<Slider
						label="X"
						value={element.type.x}
						min={0}
						max={800}
						onchange={(value) =>
							onUpdate({
								type: { ...element.type, x: value }
							})}
					/>
					<Slider
						label="Y"
						value={element.type.y}
						min={0}
						max={600}
						onchange={(value) =>
							onUpdate({
								type: { ...element.type, y: value }
							})}
					/>
				</section>

				<section class="property-section">
					<h4 class="section-title">SIZE</h4>
					<Slider
						label="Diameter"
						value={element.type.diameter}
						min={10}
						max={200}
						onchange={(value) =>
							onUpdate({
								type: { ...element.type, diameter: value }
							})}
					/>
				</section>

				<section class="property-section">
					<h4 class="section-title">FILL COLOR</h4>
					{#if element.style.fill}
						<ColorPicker
							color={element.style.fill}
							onchange={(color) =>
								onUpdate({
									style: { ...element.style, fill: color }
								})}
						/>
					{/if}
				</section>

				<section class="property-section">
					<h4 class="section-title">BEHAVIOR</h4>
					<select
						class="behavior-select"
						value={element.behavior.kind}
						onchange={(e) => {
							const kind = e.currentTarget.value;
							if (kind === 'static') {
								onUpdate({ behavior: { kind: 'static' } });
							} else if (kind === 'followMouse') {
								onUpdate({ behavior: { kind: 'followMouse', property: 'both' } });
							}
						}}
					>
						<option value="static">STATIC</option>
						<option value="followMouse">FOLLOW MOUSE</option>
					</select>
				</section>
			{:else if element.type.kind === 'rectangle'}
				<section class="property-section">
					<h4 class="section-title">POSITION</h4>
					<Slider
						label="X"
						value={element.type.x}
						min={0}
						max={800}
						onchange={(value) =>
							onUpdate({
								type: { ...element.type, x: value }
							})}
					/>
					<Slider
						label="Y"
						value={element.type.y}
						min={0}
						max={600}
						onchange={(value) =>
							onUpdate({
								type: { ...element.type, y: value }
							})}
					/>
				</section>

				<section class="property-section">
					<h4 class="section-title">SIZE</h4>
					<Slider
						label="Width"
						value={element.type.width}
						min={10}
						max={400}
						onchange={(value) =>
							onUpdate({
								type: { ...element.type, width: value }
							})}
					/>
					<Slider
						label="Height"
						value={element.type.height}
						min={10}
						max={400}
						onchange={(value) =>
							onUpdate({
								type: { ...element.type, height: value }
							})}
					/>
				</section>

				<section class="property-section">
					<h4 class="section-title">FILL COLOR</h4>
					{#if element.style.fill}
						<ColorPicker
							color={element.style.fill}
							onchange={(color) =>
								onUpdate({
									style: { ...element.style, fill: color }
								})}
						/>
					{/if}
				</section>
			{/if}
		</div>
	{:else}
		<div class="inspector-empty">
			<div class="empty-icon">○</div>
			<p class="empty-text">SELECT AN ELEMENT TO EDIT ITS PROPERTIES</p>
		</div>
	{/if}
</div>

<style>
	.inspector {
		width: 100%;
		height: 100%;
		background: #ffffff;
		overflow-y: auto;
	}

	.inspector-content {
		padding: 2rem;
	}

	.inspector-title {
		margin: 0 0 2rem 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: #000000;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 3px solid #000000;
		padding-bottom: 1rem;
	}

	.property-section {
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 2px solid #000000;
	}

	.property-section:last-child {
		border-bottom: none;
	}

	.section-title {
		margin: 0 0 1rem 0;
		font-size: 0.75rem;
		font-weight: 700;
		color: #000000;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.behavior-select {
		width: 100%;
		padding: 0.75rem;
		border: 3px solid #000000;
		border-radius: 0;
		background: #ffffff;
		font-size: 0.75rem;
		cursor: pointer;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-family: 'Space Grotesk', sans-serif;
	}

	.behavior-select:focus {
		outline: none;
		background: #f5f5f5;
	}

	.inspector-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 2rem;
		text-align: center;
	}

	.empty-icon {
		font-size: 4rem;
		color: #000000;
		margin-bottom: 1rem;
		font-weight: 700;
	}

	.empty-text {
		color: #000000;
		font-size: 0.75rem;
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
	}
</style>
