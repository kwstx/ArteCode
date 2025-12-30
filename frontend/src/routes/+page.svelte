<script lang="ts">
	import P5Runtime from '$lib/components/P5Runtime.svelte';
	import CanvasOverlay from '$lib/components/CanvasOverlay.svelte';
	import Inspector from '$lib/components/Inspector.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import {
		sceneToCode,
		DEFAULT_SCENE,
		updateElement,
		addElement,
		removeElement,
		type Scene,
		type SceneElement
	} from '$lib/sceneModel';

	// Scene is the source of truth
	let scene = $state<Scene>(DEFAULT_SCENE);
	let selectedElementId = $state<string | null>(null);

	// Code is derived from scene
	let code = $derived(sceneToCode(scene));

	// Selected element
	let selectedElement = $derived(scene.elements.find((el) => el.id === selectedElementId) ?? null);

	function handleSelect(id: string | null) {
		selectedElementId = id;
	}

	function handleUpdate(id: string, updates: Partial<SceneElement>) {
		scene = updateElement(scene, id, updates);
	}

	function handleAddCircle() {
		const newCircle: SceneElement = {
			id: `circle-${Date.now()}`,
			type: { kind: 'circle', x: 400, y: 300, diameter: 50 },
			style: {
				fill: { mode: 'rgb', r: 100, g: 150, b: 255 },
				noStroke: true
			},
			behavior: { kind: 'static' }
		};
		scene = addElement(scene, newCircle);
		selectedElementId = newCircle.id;
	}

	function handleAddRectangle() {
		const newRect: SceneElement = {
			id: `rect-${Date.now()}`,
			type: { kind: 'rectangle', x: 350, y: 250, width: 100, height: 80 },
			style: {
				fill: { mode: 'rgb', r: 255, g: 150, b: 100 },
				noStroke: true
			},
			behavior: { kind: 'static' }
		};
		scene = addElement(scene, newRect);
		selectedElementId = newRect.id;
	}

	function handleDelete() {
		if (selectedElementId) {
			scene = removeElement(scene, selectedElementId);
			selectedElementId = null;
		}
	}
</script>

<div class="app">
	<Toolbar
		onAddCircle={handleAddCircle}
		onAddRectangle={handleAddRectangle}
		onDelete={handleDelete}
		hasSelection={selectedElementId !== null}
	/>

	<div class="main">
		<div class="canvas-container">
			<P5Runtime {code} />
			<CanvasOverlay
				{scene}
				selectedId={selectedElementId}
				onSelect={handleSelect}
				onUpdate={handleUpdate}
			/>
		</div>

		<Inspector
			element={selectedElement}
			onUpdate={(updates) => {
				if (selectedElementId) {
					handleUpdate(selectedElementId, updates);
				}
			}}
		/>
	</div>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: #f0f0f0;
	}

	.main {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.canvas-container {
		flex: 1;
		position: relative;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
</style>
