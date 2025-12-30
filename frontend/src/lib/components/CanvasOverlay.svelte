<script lang="ts">
	import type { Scene, SceneElement } from '$lib/sceneModel';

	interface Props {
		scene: Scene;
		selectedId: string | null;
		onSelect: (id: string | null) => void;
		onUpdate: (id: string, updates: Partial<SceneElement>) => void;
	}

	let { scene, selectedId, onSelect, onUpdate }: Props = $props();

	// Dragging state
	let isDragging = $state(false);
	let dragStartX = $state(0);
	let dragStartY = $state(0);
	let dragElementId = $state<string | null>(null);

	function handleBackgroundClick() {
		onSelect(null);
	}

	function handleElementClick(id: string, event: MouseEvent) {
		event.stopPropagation();
		onSelect(id);
	}

	function handleDragStart(id: string, event: MouseEvent) {
		event.stopPropagation();
		isDragging = true;
		dragElementId = id;
		dragStartX = event.clientX;
		dragStartY = event.clientY;
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging || !dragElementId) return;

		const dx = event.clientX - dragStartX;
		const dy = event.clientY - dragStartY;

		const element = scene.elements.find((el) => el.id === dragElementId);
		if (!element) return;

		if (element.type.kind === 'circle') {
			onUpdate(dragElementId, {
				type: {
					...element.type,
					x: element.type.x + dx,
					y: element.type.y + dy
				}
			});
		} else if (element.type.kind === 'rectangle') {
			onUpdate(dragElementId, {
				type: {
					...element.type,
					x: element.type.x + dx,
					y: element.type.y + dy
				}
			});
		}

		dragStartX = event.clientX;
		dragStartY = event.clientY;
	}

	function handleMouseUp() {
		isDragging = false;
		dragElementId = null;
	}
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} />

<svg
	class="canvas-overlay"
	width={scene.canvas.width}
	height={scene.canvas.height}
	onclick={handleBackgroundClick}
>
	{#each scene.elements as element}
		{#if element.type.kind === 'circle'}
			<!-- Invisible hit area for easier selection -->
			<circle
				cx={element.type.x}
				cy={element.type.y}
				r={element.type.diameter / 2}
				fill="transparent"
				stroke="transparent"
				stroke-width="10"
				onclick={(e) => handleElementClick(element.id, e)}
				onmousedown={(e) => handleDragStart(element.id, e)}
				style="cursor: {selectedId === element.id ? 'move' : 'pointer'}"
				class="element-hitbox"
			/>

			<!-- Selection outline -->
			{#if selectedId === element.id}
				<circle
					cx={element.type.x}
					cy={element.type.y}
					r={element.type.diameter / 2}
					fill="none"
					stroke="#0066ff"
					stroke-width="2"
					stroke-dasharray="5,5"
					pointer-events="none"
					class="selection-outline"
				/>

				<!-- Resize handle -->
				<circle
					cx={element.type.x + element.type.diameter / 2}
					cy={element.type.y}
					r="6"
					fill="#0066ff"
					stroke="#fff"
					stroke-width="2"
					style="cursor: ew-resize"
					class="resize-handle"
				/>
			{/if}
		{:else if element.type.kind === 'rectangle'}
			<!-- Invisible hit area -->
			<rect
				x={element.type.x - 5}
				y={element.type.y - 5}
				width={element.type.width + 10}
				height={element.type.height + 10}
				fill="transparent"
				stroke="transparent"
				onclick={(e) => handleElementClick(element.id, e)}
				onmousedown={(e) => handleDragStart(element.id, e)}
				style="cursor: {selectedId === element.id ? 'move' : 'pointer'}"
				class="element-hitbox"
			/>

			<!-- Selection outline -->
			{#if selectedId === element.id}
				<rect
					x={element.type.x}
					y={element.type.y}
					width={element.type.width}
					height={element.type.height}
					fill="none"
					stroke="#0066ff"
					stroke-width="2"
					stroke-dasharray="5,5"
					pointer-events="none"
					class="selection-outline"
				/>

				<!-- Resize handles -->
				<circle
					cx={element.type.x + element.type.width}
					cy={element.type.y + element.type.height}
					r="6"
					fill="#0066ff"
					stroke="#fff"
					stroke-width="2"
					style="cursor: nwse-resize"
					class="resize-handle"
				/>
			{/if}
		{/if}
	{/each}
</svg>

<style>
	.canvas-overlay {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: all;
		user-select: none;
	}

	.element-hitbox {
		transition: opacity 0.15s;
	}

	.element-hitbox:hover {
		opacity: 0.8;
	}

	.selection-outline {
		animation: dash 0.5s linear infinite;
	}

	@keyframes dash {
		to {
			stroke-dashoffset: -10;
		}
	}

	.resize-handle {
		cursor: pointer;
		transition: transform 0.15s;
	}

	.resize-handle:hover {
		transform: scale(1.2);
	}
</style>
