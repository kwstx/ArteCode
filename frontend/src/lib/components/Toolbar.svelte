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
				<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
			</svg>
			<span class="label">Circle</span>
		</button>

		<button onclick={onAddRectangle} title="Add Rectangle" class="tool-button">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<rect x="2" y="2" width="12" height="12" stroke="currentColor" stroke-width="1.5" />
			</svg>
			<span class="label">Rectangle</span>
		</button>
	</div>

	<div class="spacer"></div>

	<div class="tool-group">
		<button
			onclick={onDelete}
			disabled={!hasSelection}
			title="Delete Selected Element"
			class="tool-button"
		>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path
					d="M3 4H13M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6 7V11M10 7V11M4 4H12V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4Z"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<span class="label">Delete</span>
		</button>
	</div>
</div>

<style>
	.toolbar {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
		background: #ffffff;
		border-bottom: 1px solid #e5e5e5;
	}

	.tool-group {
		display: flex;
		gap: 0.5rem;
	}

	.spacer {
		flex: 1;
	}

	.tool-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		border: 1px solid #1a1a1a;
		border-radius: 4px;
		background: #ffffff;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		color: #1a1a1a;
		transition: all 0.15s ease;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		letter-spacing: 0.01em;
	}

	.tool-button:hover:not(:disabled) {
		background: #1a1a1a;
		color: #ffffff;
	}

	.tool-button:hover:not(:disabled) svg {
		color: #ffffff;
	}

	.tool-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
		border-color: #e5e5e5;
		color: #999;
	}

	.tool-button svg {
		color: #1a1a1a;
		transition: color 0.15s ease;
	}

	.label {
		font-size: 0.875rem;
	}
</style>
