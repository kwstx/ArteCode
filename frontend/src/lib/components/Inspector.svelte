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
			<h3 class="inspector-title">Properties</h3>

			{#if element.type.kind === 'circle'}
				<section class="property-section">
					<h4 class="section-title">Position</h4>
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
					<h4 class="section-title">Size</h4>
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
					<h4 class="section-title">Fill Color</h4>
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
					<h4 class="section-title">Behavior</h4>
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
						<option value="static">Static</option>
						<option value="followMouse">Follow Mouse</option>
					</select>
				</section>
			{:else if element.type.kind === 'rectangle'}
				<section class="property-section">
					<h4 class="section-title">Position</h4>
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
					<h4 class="section-title">Size</h4>
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
					<h4 class="section-title">Fill Color</h4>
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
			<p class="empty-text">Select an element to edit its properties</p>
		</div>
	{/if}
</div>

<style>
	.inspector {
		width: 300px;
		height: 100%;
		background: #fafafa;
		border-left: 1px solid #e0e0e0;
		overflow-y: auto;
	}

	.inspector-content {
		padding: 1.5rem;
	}

	.inspector-title {
		margin: 0 0 1.5rem 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #222;
	}

	.property-section {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid #e8e8e8;
	}

	.property-section:last-child {
		border-bottom: none;
	}

	.section-title {
		margin: 0 0 1rem 0;
		font-size: 0.75rem;
		font-weight: 600;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.behavior-select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d0d0d0;
		border-radius: 4px;
		background: #fff;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.behavior-select:focus {
		outline: none;
		border-color: #0066ff;
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
		color: #d0d0d0;
		margin-bottom: 1rem;
	}

	.empty-text {
		color: #999;
		font-size: 0.875rem;
		margin: 0;
	}
</style>
