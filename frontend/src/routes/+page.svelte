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
		<div class="header-content">
			<h1>ArteCode</h1>
			<p>Visual p5.js Editor</p>
		</div>
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
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<rect x="2" y="2" width="12" height="12" stroke="currentColor" stroke-width="1.5" />
						<circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5" />
					</svg>
					Visual
				</button>
				<button class:active={currentTab === 'sketch'} onclick={() => (currentTab = 'sketch')}>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path
							d="M2 14L6 2L10 14M4 10H8"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
					Sketch
				</button>
				<button class:active={currentTab === 'ai'} onclick={() => (currentTab = 'ai')}>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
						<circle cx="6" cy="7" r="1" fill="currentColor" />
						<circle cx="10" cy="7" r="1" fill="currentColor" />
						<path
							d="M6 10C6 10 7 11 8 11C9 11 10 10 10 10"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
					AI
				</button>
				<button class:active={currentTab === 'effects'} onclick={() => (currentTab = 'effects')}>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path
							d="M8 2L9 6L13 7L9 8L8 12L7 8L3 7L7 6L8 2Z"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linejoin="round"
						/>
					</svg>
					Effects
				</button>
				<button class:active={currentTab === 'export'} onclick={() => (currentTab = 'export')}>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path
							d="M8 2V10M8 10L5 7M8 10L11 7"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M2 12V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V12"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
					Export
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
						<h3>AI Assistant</h3>
						<p>Describe what you want to create</p>
						<textarea bind:value={aiPrompt} placeholder="e.g., Create a bouncing ball"></textarea>
						<button onclick={handleAIGenerate} disabled={isGenerating} class="primary-button">
							{isGenerating ? 'Generating...' : 'Generate Code'}
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
	* {
		box-sizing: border-box;
	}

	.app {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: #fafafa;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
		color: #1a1a1a;
	}

	.header {
		background: #ffffff;
		border-bottom: 1px solid #e5e5e5;
		padding: 0;
	}

	.header-content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1.5rem 2rem;
	}

	.header h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #1a1a1a;
		letter-spacing: -0.02em;
	}

	.header p {
		margin: 0.25rem 0 0 0;
		font-size: 0.875rem;
		color: #666;
		font-weight: 400;
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
		border-right: 1px solid #e5e5e5;
	}

	.sidebar {
		width: 360px;
		background: #ffffff;
		display: flex;
		flex-direction: column;
	}

	.tabs {
		display: flex;
		border-bottom: 1px solid #e5e5e5;
		background: #fafafa;
	}

	.tabs button {
		flex: 1;
		padding: 0.875rem 0.5rem;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 0.8125rem;
		color: #666;
		transition: all 0.15s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.375rem;
		font-weight: 500;
		letter-spacing: 0.01em;
	}

	.tabs button svg {
		opacity: 0.6;
		transition: opacity 0.15s ease;
	}

	.tabs button:hover {
		background: #f5f5f5;
		color: #1a1a1a;
	}

	.tabs button:hover svg {
		opacity: 1;
	}

	.tabs button.active {
		background: #ffffff;
		color: #1a1a1a;
		border-bottom: 2px solid #1a1a1a;
	}

	.tabs button.active svg {
		opacity: 1;
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
		font-size: 1rem;
		font-weight: 600;
		color: #1a1a1a;
	}

	.ai-panel p {
		margin: 0 0 1.25rem 0;
		color: #666;
		font-size: 0.875rem;
	}

	.ai-panel textarea {
		width: 100%;
		min-height: 120px;
		padding: 0.875rem;
		border: 1px solid #e5e5e5;
		border-radius: 4px;
		font-family: inherit;
		font-size: 0.875rem;
		resize: vertical;
		margin-bottom: 1rem;
		background: #fafafa;
		color: #1a1a1a;
		transition: all 0.15s ease;
	}

	.ai-panel textarea:focus {
		outline: none;
		border-color: #1a1a1a;
		background: #ffffff;
	}

	.ai-panel textarea::placeholder {
		color: #999;
	}

	.primary-button {
		width: 100%;
		padding: 0.875rem;
		background: #1a1a1a;
		color: #ffffff;
		border: none;
		border-radius: 4px;
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.15s ease;
		letter-spacing: 0.01em;
	}

	.primary-button:hover:not(:disabled) {
		background: #000000;
	}

	.primary-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
