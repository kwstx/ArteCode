<script lang="ts">
	import { exportSketch, sanitizeFilename, getExportMetadata } from '$lib/exportUtils';

	interface Props {
		code: string;
		projectName?: string;
	}

	let { code, projectName = 'My Sketch' }: Props = $props();

	let isExporting = $state(false);
	let exportSuccess = $state(false);

	function handleExport() {
		isExporting = true;
		exportSuccess = false;

		try {
			const filename = sanitizeFilename(projectName) + '.html';
			exportSketch(code, filename);

			exportSuccess = true;
			setTimeout(() => {
				exportSuccess = false;
			}, 3000);
		} catch (error) {
			console.error('Export failed:', error);
			alert('Export failed. Please try again.');
		} finally {
			isExporting = false;
		}
	}

	const metadata = $derived(getExportMetadata(code));
</script>

<div class="export-panel">
	<h3>📦 Export Project</h3>
	<p class="description">
		Export your sketch as a self-contained HTML file that runs anywhere - no dependencies needed!
	</p>

	<div class="info-grid">
		<div class="info-item">
			<span class="label">Lines of code:</span>
			<span class="value">{metadata.lines}</span>
		</div>
		<div class="info-item">
			<span class="label">File size:</span>
			<span class="value">{metadata.sizeKB} KB</span>
		</div>
		<div class="info-item">
			<span class="label">Has setup():</span>
			<span class="value">{metadata.hasSetup ? '✓' : '✗'}</span>
		</div>
		<div class="info-item">
			<span class="label">Has draw():</span>
			<span class="value">{metadata.hasDraw ? '✓' : '✗'}</span>
		</div>
	</div>

	<div class="features">
		<h4>What's included:</h4>
		<ul>
			<li>✓ Complete HTML file</li>
			<li>✓ p5.js library (CDN)</li>
			<li>✓ Your sketch code</li>
			<li>✓ Responsive styling</li>
			<li>✓ No external dependencies</li>
		</ul>
	</div>

	<button onclick={handleExport} disabled={isExporting} class="export-button">
		{#if isExporting}
			⏳ Exporting...
		{:else if exportSuccess}
			✓ Exported!
		{:else}
			📥 Export as HTML
		{/if}
	</button>

	{#if exportSuccess}
		<p class="success-message">
			✓ Successfully exported as <strong>{sanitizeFilename(projectName)}.html</strong>
		</p>
	{/if}

	<div class="usage-tips">
		<h4>How to use:</h4>
		<ol>
			<li>Click "Export as HTML" to download the file</li>
			<li>Open the HTML file in any web browser</li>
			<li>Share it online, add to your portfolio, or use in installations</li>
		</ol>
	</div>
</div>

<style>
	.export-panel {
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

	h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		color: #333;
	}

	.description {
		margin: 0 0 1.5rem 0;
		color: #666;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: #f8f8f8;
		border-radius: 6px;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.label {
		font-size: 0.85rem;
		color: #666;
	}

	.value {
		font-weight: 600;
		color: #333;
	}

	.features {
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: #f0f7ff;
		border-left: 3px solid #0066ff;
		border-radius: 4px;
	}

	.features ul {
		margin: 0.5rem 0 0 0;
		padding-left: 1.5rem;
		list-style: none;
	}

	.features li {
		margin: 0.25rem 0;
		color: #333;
		font-size: 0.9rem;
	}

	.export-button {
		width: 100%;
		padding: 1rem 1.5rem;
		background: #4caf50;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.export-button:hover:not(:disabled) {
		background: #45a049;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
	}

	.export-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.success-message {
		margin: 1rem 0 0 0;
		padding: 0.75rem;
		background: #e8f5e9;
		border-left: 3px solid #4caf50;
		border-radius: 4px;
		color: #2e7d32;
		font-size: 0.9rem;
	}

	.usage-tips {
		margin-top: 1.5rem;
		padding: 1rem;
		background: #fff9e6;
		border-left: 3px solid #ffc107;
		border-radius: 4px;
	}

	.usage-tips ol {
		margin: 0.5rem 0 0 0;
		padding-left: 1.5rem;
	}

	.usage-tips li {
		margin: 0.5rem 0;
		color: #666;
		font-size: 0.9rem;
		line-height: 1.5;
	}
</style>
