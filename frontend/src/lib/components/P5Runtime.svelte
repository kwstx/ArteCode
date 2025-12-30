<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import { htmlTemplate } from '$lib/runtimeTemplate';

	interface Props {
		code?: string;
	}

	let { code = '' }: Props = $props();

	let iframe: HTMLIFrameElement | undefined = $state();

	$effect(() => {
		if (iframe && code) {
			iframe.srcdoc = htmlTemplate(code);
		}
	});

	function handleMessage(event: MessageEvent) {
		if (event.data?.type === 'ERROR') {
			console.error('Runtime Error:', event.data.message);
		}
	}

	onMount(() => {
		window.addEventListener('message', handleMessage);
	});

	onDestroy(() => {
		window.removeEventListener('message', handleMessage);
	});
</script>

<div class="iframe-container">
	<iframe
		bind:this={iframe}
		title="p5-runtime"
		sandbox="allow-scripts allow-downloads allow-pointer-lock allow-same-origin"
	></iframe>
</div>

<style>
	.iframe-container,
	iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}
	.iframe-container {
		background: #f0f0f0;
	}
</style>
