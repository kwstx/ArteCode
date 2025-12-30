<script lang="ts">
	import type { SketchShape, DrawingTool } from '$lib/sketchTypes';
	import { generateDescription, getSketchSummary } from '$lib/sketchDescription';

	interface Props {
		onGenerate: (description: string) => void;
	}

	let { onGenerate }: Props = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let shapes = $state<SketchShape[]>([]);
	let currentTool = $state<DrawingTool>('circle');
	let isDrawing = $state(false);
	let startX = $state(0);
	let startY = $state(0);

	function handleMouseDown(e: MouseEvent) {
		if (!ctx) return;
		isDrawing = true;
		const rect = canvas.getBoundingClientRect();
		startX = e.clientX - rect.left;
		startY = e.clientY - rect.top;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDrawing || !ctx) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Redraw everything + preview
		redrawCanvas();

		// Draw preview
		ctx.strokeStyle = '#0066ff';
		ctx.fillStyle = 'rgba(0, 102, 255, 0.2)';
		ctx.lineWidth = 2;

		if (currentTool === 'circle') {
			const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
			ctx.beginPath();
			ctx.arc(startX, startY, radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
		} else if (currentTool === 'rectangle') {
			ctx.fillRect(startX, startY, x - startX, y - startY);
			ctx.strokeRect(startX, startY, x - startX, y - startY);
		} else if (currentTool === 'line') {
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(x, y);
			ctx.stroke();
		}
	}

	function handleMouseUp(e: MouseEvent) {
		if (!isDrawing) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Add shape to collection
		if (currentTool === 'circle') {
			const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
			if (radius > 5) {
				// Minimum size
				shapes.push({ type: 'circle', x: startX, y: startY, radius });
			}
		} else if (currentTool === 'rectangle') {
			const width = x - startX;
			const height = y - startY;
			if (Math.abs(width) > 5 && Math.abs(height) > 5) {
				// Minimum size
				shapes.push({ type: 'rectangle', x: startX, y: startY, width, height });
			}
		} else if (currentTool === 'line') {
			const distance = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
			if (distance > 5) {
				// Minimum length
				shapes.push({ type: 'line', x1: startX, y1: startY, x2: x, y2: y });
			}
		}

		isDrawing = false;
		redrawCanvas();
	}

	function redrawCanvas() {
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Background
		ctx.fillStyle = '#f8f8f8';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Grid
		ctx.strokeStyle = '#e0e0e0';
		ctx.lineWidth = 1;
		for (let i = 0; i < canvas.width; i += 50) {
			ctx.beginPath();
			ctx.moveTo(i, 0);
			ctx.lineTo(i, canvas.height);
			ctx.stroke();
		}
		for (let i = 0; i < canvas.height; i += 50) {
			ctx.beginPath();
			ctx.moveTo(0, i);
			ctx.lineTo(canvas.width, i);
			ctx.stroke();
		}

		// Draw all shapes
		for (const shape of shapes) {
			ctx.strokeStyle = '#333';
			ctx.fillStyle = '#0066ff';
			ctx.lineWidth = 2;

			if (shape.type === 'circle') {
				ctx.beginPath();
				ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();
			} else if (shape.type === 'rectangle') {
				ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
				ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
			} else if (shape.type === 'line') {
				ctx.beginPath();
				ctx.moveTo(shape.x1, shape.y1);
				ctx.lineTo(shape.x2, shape.y2);
				ctx.stroke();
			}
		}
	}

	function handleClear() {
		shapes = [];
		redrawCanvas();
	}

	function handleUndo() {
		if (shapes.length > 0) {
			shapes = shapes.slice(0, -1);
			redrawCanvas();
		}
	}

	function handleGenerate() {
		const description = generateDescription({
			shapes,
			canvasWidth: canvas.width,
			canvasHeight: canvas.height
		});
		onGenerate(description);
	}

	$effect(() => {
		if (canvas) {
			ctx = canvas.getContext('2d');
			redrawCanvas();
		}
	});
</script>

<div class="sketch-canvas">
	<h3>✏️ Sketch Your Idea</h3>
	<p class="hint">Draw shapes on the canvas, then generate p5.js code from your sketch!</p>

	<div class="tools">
		<div class="tool-buttons">
			<button class:active={currentTool === 'circle'} onclick={() => (currentTool = 'circle')}>
				<span class="icon">○</span>
				Circle
			</button>
			<button
				class:active={currentTool === 'rectangle'}
				onclick={() => (currentTool = 'rectangle')}
			>
				<span class="icon">□</span>
				Rectangle
			</button>
			<button class:active={currentTool === 'line'} onclick={() => (currentTool = 'line')}>
				<span class="icon">/</span>
				Line
			</button>
		</div>

		<div class="action-buttons">
			<button onclick={handleUndo} disabled={shapes.length === 0} class="undo">↶ Undo</button>
			<button onclick={handleClear} disabled={shapes.length === 0} class="clear"> 🗑️ Clear </button>
		</div>
	</div>

	<div class="canvas-container">
		<canvas
			bind:this={canvas}
			width={800}
			height={400}
			onmousedown={handleMouseDown}
			onmousemove={handleMouseMove}
			onmouseup={handleMouseUp}
			onmouseleave={() => (isDrawing = false)}
		></canvas>
	</div>

	<div class="footer">
		<div class="summary">
			{#if shapes.length > 0}
				<strong>Sketch contains:</strong>
				{getSketchSummary({ shapes, canvasWidth: 800, canvasHeight: 400 })}
			{:else}
				<em>Draw some shapes to get started</em>
			{/if}
		</div>

		<button onclick={handleGenerate} class="generate" disabled={shapes.length === 0}>
			🎨 Generate Code from Sketch
		</button>
	</div>
</div>

<style>
	.sketch-canvas {
		padding: 1.5rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.3rem;
		color: #333;
	}

	.hint {
		margin: 0 0 1rem 0;
		color: #666;
		font-size: 0.9rem;
	}

	.tools {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		gap: 1rem;
	}

	.tool-buttons,
	.action-buttons {
		display: flex;
		gap: 0.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		border: 2px solid #ddd;
		background: white;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	button:hover:not(:disabled) {
		border-color: #0066ff;
		background: #f0f7ff;
	}

	button.active {
		border-color: #0066ff;
		background: #0066ff;
		color: white;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.icon {
		font-size: 1.2rem;
		line-height: 1;
	}

	.canvas-container {
		border: 2px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	canvas {
		display: block;
		cursor: crosshair;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.summary {
		flex: 1;
		color: #666;
		font-size: 0.9rem;
	}

	.generate {
		padding: 0.75rem 1.5rem;
		background: #4caf50;
		color: white;
		border: none;
		font-size: 1rem;
		font-weight: 600;
	}

	.generate:hover:not(:disabled) {
		background: #45a049;
		border-color: #45a049;
	}

	.clear {
		background: #f44336;
		color: white;
		border-color: #f44336;
	}

	.clear:hover:not(:disabled) {
		background: #da190b;
		border-color: #da190b;
	}

	.undo {
		background: #ff9800;
		color: white;
		border-color: #ff9800;
	}

	.undo:hover:not(:disabled) {
		background: #e68900;
		border-color: #e68900;
	}
</style>
