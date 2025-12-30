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
			<span class="icon">○</span>
			<span class="label">Circle</span>
		</button>

		<button onclick={onAddRectangle} title="Add Rectangle" class="tool-button">
			<span class="icon">□</span>
			<span class="label">Rectangle</span>
		</button>
	</div>

	<div class="spacer"></div>

	<div class="tool-group">
		<button
			onclick={onDelete}
			disabled={!hasSelection}
			title="Delete Selected Element"
			class="tool-button danger"
		>
			<span class="icon">🗑️</span>
			<span class="label">Delete</span>
		</button>
	</div>
</div>

<style>
	.toolbar {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: #ffffff;
		border-bottom: 1px solid #e0e0e0;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
		padding: 0.5rem 1rem;
		border: 1px solid #d0d0d0;
		border-radius: 6px;
		background: #ffffff;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		color: #333;
		transition: all 0.15s;
	}

	.tool-button:hover:not(:disabled) {
		background: #f5f5f5;
		border-color: #0066ff;
	}

	.tool-button:active:not(:disabled) {
		transform: translateY(1px);
	}

	.tool-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.tool-button.danger {
		color: #d32f2f;
	}

	.tool-button.danger:hover:not(:disabled) {
		background: #ffebee;
		border-color: #d32f2f;
	}

	.icon {
		font-size: 1.25rem;
		line-height: 1;
	}

	.label {
		font-size: 0.875rem;
	}
</style>
