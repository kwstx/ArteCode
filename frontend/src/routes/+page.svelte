<script lang="ts">
	import { onMount } from 'svelte';
	import P5Runtime from '$lib/components/P5Runtime.svelte';
	import { sceneToCode, DEFAULT_SCENE, type Scene } from '$lib/sceneModel';

	// Scene is the source of truth
	let scene = $state<Scene>(DEFAULT_SCENE);

	// Code is derived from scene
	let code = $derived(sceneToCode(scene));

	function updateCode(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		code = target.value;
	}
</script>

<div class="container">
	<div class="editor">
		<textarea value={code} oninput={updateCode}></textarea>
	</div>
	<div class="preview">
		<P5Runtime {code} />
	</div>
</div>

<style>
	.container {
		display: flex;
		height: 100vh;
	}
	.editor,
	.preview {
		flex: 1;
		height: 100%;
	}
	textarea {
		width: 100%;
		height: 100%;
		font-family: monospace;
		padding: 1rem;
		resize: none;
		border: none;
		background: #f4f4f4;
	}
</style>
