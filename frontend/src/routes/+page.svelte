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

	let scene = $state<Scene>({ ...DEFAULT_SCENE, effects: DEFAULT_EFFECTS });
	let selectedElementId = $state<string | null>(null);
	let currentTab = $state<'visual' | 'sketch' | 'ai' | 'effects' | 'export'>('visual');
	let showWelcome = $state(false);
	let aiPrompt = $state('');
	let isGenerating = $state(false);

	let code = $derived(sceneToCode(scene));
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
			style: { fill: { mode: 'rgb', r: 100, g: 150, b: 255 }, noStroke: true },
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
			style: { fill: { mode: 'rgb', r: 255, g: 150, b: 100 }, noStroke: true },
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
			if (!response.ok) throw new Error('AI generation failed');
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
			<h1>ARTECODE</h1>
			<div class="header-meta">VISUAL P5.JS EDITOR</div>
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
					VISUAL
				</button>
				<button class:active={currentTab === 'sketch'} onclick={() => (currentTab = 'sketch')}>
					SKETCH
				</button>
				<button class:active={currentTab === 'ai'} onclick={() => (currentTab = 'ai')}> AI </button>
				<button class:active={currentTab === 'effects'} onclick={() => (currentTab = 'effects')}>
					EFFECTS
				</button>
				<button class:active={currentTab === 'export'} onclick={() => (currentTab = 'export')}>
					EXPORT
				</button>
			</div>

			<div class="tab-content">
				{#if currentTab === 'visual'}
					<Inspector
						element={selectedElement}
						onUpdate={(updates) => {
							if (selectedElementId) handleUpdate(selectedElementId, updates);
						}}
					/>
				{:else if currentTab === 'sketch'}
					<SketchCanvas onGenerate={handleSketchGenerate} />
				{:else if currentTab === 'ai'}
					<div class="ai-panel">
						<h3>AI ASSISTANT</h3>
						<p>DESCRIBE WHAT YOU WANT TO CREATE</p>
						<textarea bind:value={aiPrompt} placeholder="CREATE A BOUNCING BALL"></textarea>
						<button onclick={handleAIGenerate} disabled={isGenerating} class="primary-button">
							{isGenerating ? 'GENERATING...' : 'GENERATE CODE'}
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
	@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			'Space Grotesk',
			-apple-system,
			BlinkMacSystemFont,
			'Helvetica Neue',
			Arial,
			sans-serif;
	}

	* {
		box-sizing: border-box;
	}

	.app {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: #ffffff;
		font-family:
			'Space Grotesk',
			-apple-system,
			BlinkMacSystemFont,
			'Helvetica Neue',
			Arial,
			sans-serif;
		color: #000000;
	}

	.header {
		background: #000000;
		border-bottom: 4px solid #000000;
	}

	.header-content {
		padding: 1.5rem 2rem;
	}

	.header h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.header-meta {
		margin-top: 0.25rem;
		font-size: 0.75rem;
		color: #ffffff;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		font-weight: 500;
	}

	.main {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.canvas-container {
		flex: 1;
		position: relative;
		background: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-right: 3px solid #000000;
	}

	.sidebar {
		width: 380px;
		background: #ffffff;
		display: flex;
		flex-direction: column;
		border-left: 3px solid #000000;
	}

	.tabs {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		border-bottom: 3px solid #000000;
		background: #ffffff;
	}

	.tabs button {
		padding: 1rem 0.5rem;
		border: none;
		border-right: 2px solid #000000;
		background: #ffffff;
		cursor: pointer;
		font-size: 0.75rem;
		color: #000000;
		transition: all 0.1s ease;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		font-family: 'Space Grotesk', sans-serif;
	}

	.tabs button:last-child {
		border-right: none;
	}

	.tabs button:hover {
		background: #000000;
		color: #ffffff;
	}

	.tabs button.active {
		background: #000000;
		color: #ffffff;
	}

	.tab-content {
		flex: 1;
		overflow-y: auto;
	}

	.ai-panel {
		padding: 2rem;
	}

	.ai-panel h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: #000000;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.ai-panel p {
		margin: 0 0 1.5rem 0;
		color: #000000;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		font-weight: 500;
	}

	.ai-panel textarea {
		width: 100%;
		min-height: 120px;
		padding: 1rem;
		border: 3px solid #000000;
		border-radius: 0;
		font-family: 'Space Grotesk', monospace;
		font-size: 0.875rem;
		resize: vertical;
		margin-bottom: 1rem;
		background: #ffffff;
		color: #000000;
		transition: all 0.1s ease;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.ai-panel textarea:focus {
		outline: none;
		background: #f5f5f5;
	}

	.ai-panel textarea::placeholder {
		color: #999999;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.primary-button {
		width: 100%;
		padding: 1rem;
		background: #000000;
		color: #ffffff;
		border: 3px solid #000000;
		border-radius: 0;
		font-weight: 700;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.1s ease;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		font-family: 'Space Grotesk', sans-serif;
	}

	.primary-button:hover:not(:disabled) {
		background: #ffffff;
		color: #000000;
	}

	.primary-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
