<script lang="ts">
	interface Props {
		onAddCircle: () => void;
		onAddRectangle: () => void;
		onDelete: () => void;
		hasSelection: boolean;
	}

	let { onAddCircle, onAddRectangle, onDelete, hasSelection }: Props = $props();
</script>

<div class="toolbar">
	<div class="tool-group">
		<button onclick={onAddCircle} title="Add Circle" class="tool-button">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" />
			</svg>
			<span class="label">CIRCLE</span>
		</button>

		<button onclick={onAddRectangle} title="Add Rectangle" class="tool-button">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<rect x="2" y="2" width="12" height="12" stroke="currentColor" stroke-width="2" />
			</svg>
			<span class="label">RECTANGLE</span>
		</button>
	</div>

	<div class="spacer"></div>

	<div class="tool-group">
		<button
			onclick={onDelete}
			disabled={!hasSelection}
			title="Delete Selected Element"
			class="tool-button delete"
		>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path
					d="M3 4H13M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6 7V11M10 7V11M4 4H12V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<span class="label">DELETE</span>
		</button>
	</div>
</div>

<style>
	.toolbar {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 2rem;
		background: #ffffff;
		border-bottom: 3px solid #000000;
	}

	.tool-group {
		display: flex;
		gap: 0.75rem;
	}

	.spacer {
		flex: 1;
	}

	.tool-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		border: 3px solid #000000;
		border-radius: 0;
		background: #ffffff;
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 700;
		color: #000000;
		transition: all 0.1s ease;
		font-family:
			'Space Grotesk',
			-apple-system,
			sans-serif;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.tool-button:hover:not(:disabled) {
		background: #000000;
		color: #ffffff;
	}

	.tool-button:hover:not(:disabled) svg {
		color: #ffffff;
	}

	.tool-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.tool-button.delete:hover:not(:disabled) {
		background: #000000;
		color: #ffffff;
	}

	.tool-button svg {
		color: #000000;
		transition: color 0.1s ease;
	}

	.label {
		font-size: 0.75rem;
	}
</style>
