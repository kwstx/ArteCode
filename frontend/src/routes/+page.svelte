<script lang="ts">
	import { onMount } from 'svelte';
	import P5Runtime from '$lib/components/P5Runtime.svelte';
	import CanvasOverlay from '$lib/components/CanvasOverlay.svelte';
	import Inspector from '$lib/components/Inspector.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import SketchCanvas from '$lib/components/SketchCanvas.svelte';
	import EffectsPanel from '$lib/components/EffectsPanel.svelte';
	import ExportPanel from '$lib/components/ExportPanel.svelte';
	import WelcomeModal from '$lib/components/WelcomeModal.svelte';
	import {
		sceneToCode,
		DEFAULT_SCENE,
		updateElement,
		addElement,
		removeElement,
		type Scene,
		type SceneElement
	} from '$lib/sceneModel';
	import { DEFAULT_EFFECTS } from '$lib/effectPresets';
	import { EXAMPLE_PROJECTS } from '$lib/exampleProjects';
	import { isNewUser, trackElementCreated } from '$lib/onboardingState';

	// Scene is the source of truth
	let scene = $state<Scene>({ ...DEFAULT_SCENE, effects: DEFAULT_EFFECTS });
	let selectedElementId = $state<string | null>(null);
	let currentTab = $state<'visual' | 'sketch' | 'ai' | 'effects' | 'export'>('visual');
	let showWelcome = $state(false);
	let aiPrompt = $state('');
	let isGenerating = $state(false);

	// Code is derived from scene
	let code = $derived(sceneToCode(scene));

	// Selected element
	let selectedElement = $derived(scene.elements.find((el) => el.id === selectedElementId) ?? null);

	onMount(() => {
		showWelcome = isNewUser();
	});

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
		trackElementCreated();
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
		trackElementCreated();
	}

	function handleDelete() {
		if (selectedElementId) {
			scene = removeElement(scene, selectedElementId);
			selectedElementId = null;
		}
	}

	function handleSketchGenerate(description: string) {
		aiPrompt = description;
		currentTab = 'ai';
	}

	async function handleAIGenerate() {
		if (!aiPrompt.trim()) return;

		isGenerating = true;
		try {
			const response = await fetch('http://localhost:3001/api/ai/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt: aiPrompt })
			});

			if (!response.ok) {
				throw new Error('AI generation failed');
			}

			const data = await response.json();
			// For now, just show the code - in a full implementation, we'd update the scene
			alert('Code generated! Check the console.');
			console.log(data.code);
		} catch (error) {
			console.error('AI generation error:', error);
			alert('Failed to generate code. Make sure the backend is running.');
		} finally {
			isGenerating = false;
		}
	}

	function handleEffectsUpdate(effects: any[]) {
		scene = { ...scene, effects };
	}

	function loadExample(exampleId: string) {
		const example = EXAMPLE_PROJECTS.find((ex) => ex.id === exampleId);
		if (example) {
			// For now, just show alert - full implementation would parse code to scene
			alert(`Loading example: ${example.title}`);
			console.log(example.code);
		}
	}
</script>

<WelcomeModal
	show={showWelcome}
	onClose={() => (showWelcome = false)}
	onStartTutorial={() => {
		showWelcome = false;
		alert('Tutorial coming soon!');
	}}
	onBrowseExamples={() => {
		showWelcome = false;
		currentTab = 'visual';
	}}
/>

<div class="app">
	<header class="header">
		<h1>🎨 ArteCode</h1>
		<p>Create beautiful p5.js sketches without writing code</p>
	</header>

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

		<div class="sidebar">
			<div class="tabs">
				<button class:active={currentTab === 'visual'} onclick={() => (currentTab = 'visual')}>
					🎨 Visual
				</button>
				<button class:active={currentTab === 'sketch'} onclick={() => (currentTab = 'sketch')}>
					✏️ Sketch
				</button>
				<button class:active={currentTab === 'ai'} onclick={() => (currentTab = 'ai')}>
					🤖 AI
				</button>
				<button class:active={currentTab === 'effects'} onclick={() => (currentTab = 'effects')}>
					✨ Effects
				</button>
				<button class:active={currentTab === 'export'} onclick={() => (currentTab = 'export')}>
					📦 Export
				</button>
			</div>

			<div class="tab-content">
				{#if currentTab === 'visual'}
					<Inspector
						element={selectedElement}
						onUpdate={(updates) => {
							if (selectedElementId) {
								handleUpdate(selectedElementId, updates);
							}
						}}
					/>
				{:else if currentTab === 'sketch'}
					<SketchCanvas onGenerate={handleSketchGenerate} />
				{:else if currentTab === 'ai'}
					<div class="ai-panel">
						<h3>🤖 AI Assistant</h3>
						<p>Describe what you want to create:</p>
						<textarea bind:value={aiPrompt} placeholder="e.g., Create a bouncing ball"></textarea>
						<button onclick={handleAIGenerate} disabled={isGenerating}>
							{isGenerating ? '⏳ Generating...' : '🎨 Generate Code'}
						</button>
					</div>
				{:else if currentTab === 'effects'}
					<EffectsPanel effects={scene.effects || []} onUpdate={handleEffectsUpdate} />
				{:else if currentTab === 'export'}
					<ExportPanel {code} projectName="My Sketch" />
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: #f0f0f0;
	}

	.header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 1.5rem 2rem;
		text-align: center;
	}

	.header h1 {
		margin: 0;
		font-size: 2rem;
	}

	.header p {
		margin: 0.5rem 0 0 0;
		opacity: 0.9;
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

	.sidebar {
		width: 400px;
		background: white;
		display: flex;
		flex-direction: column;
		border-left: 1px solid #e0e0e0;
	}

	.tabs {
		display: flex;
		border-bottom: 1px solid #e0e0e0;
		background: #f8f8f8;
	}

	.tabs button {
		flex: 1;
		padding: 0.75rem 0.5rem;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 0.85rem;
		color: #666;
		transition: all 0.2s;
	}

	.tabs button:hover {
		background: #f0f0f0;
	}

	.tabs button.active {
		background: white;
		color: #0066ff;
		font-weight: 600;
		border-bottom: 2px solid #0066ff;
	}

	.tab-content {
		flex: 1;
		overflow-y: auto;
	}

	.ai-panel {
		padding: 1.5rem;
	}

	.ai-panel h3 {
		margin: 0 0 0.5rem 0;
	}

	.ai-panel p {
		margin: 0 0 1rem 0;
		color: #666;
	}

	.ai-panel textarea {
		width: 100%;
		min-height: 100px;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-family: inherit;
		resize: vertical;
		margin-bottom: 1rem;
	}

	.ai-panel button {
		width: 100%;
		padding: 0.75rem;
		background: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		font-weight: 600;
		cursor: pointer;
	}

	.ai-panel button:hover:not(:disabled) {
		background: #45a049;
	}

	.ai-panel button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
