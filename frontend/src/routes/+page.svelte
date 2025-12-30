<script lang="ts">
	import P5Runtime from '$lib/components/P5Runtime.svelte';

	let code = $state(`function setup() {
  createCanvas(windowWidth, windowHeight);
  background(20);
}

function draw() {
  // Draw colorful circles that follow the mouse
  fill(random(255), random(255), random(255), 150);
  noStroke();
  ellipse(mouseX, mouseY, 50, 50);
}`);

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
