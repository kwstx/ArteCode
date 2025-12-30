<script lang="ts">
	import { markFirstVisit, markTutorialCompleted } from '$lib/onboardingState';

	interface Props {
		show: boolean;
		onClose: () => void;
		onStartTutorial: () => void;
		onBrowseExamples: () => void;
	}

	let { show, onClose, onStartTutorial, onBrowseExamples }: Props = $props();

	function handleStartTutorial() {
		markFirstVisit();
		onStartTutorial();
		onClose();
	}

	function handleBrowseExamples() {
		markFirstVisit();
		onBrowseExamples();
		onClose();
	}

	function handleSkip() {
		markFirstVisit();
		markTutorialCompleted();
		onClose();
	}
</script>

{#if show}
	<div class="modal-overlay" onclick={handleSkip}>
		<div class="modal-content" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h1>Welcome to ArteCode! 🎨</h1>
				<button class="close-button" onclick={handleSkip} aria-label="Close">×</button>
			</div>

			<div class="modal-body">
				<p class="tagline">Create beautiful p5.js sketches without writing code</p>

				<div class="preview">
					<div class="preview-animation">
						<!-- Animated preview placeholder -->
						<div class="circle pulse"></div>
						<div class="circle pulse delay-1"></div>
						<div class="circle pulse delay-2"></div>
					</div>
				</div>

				<div class="features">
					<div class="feature">
						<span class="icon">🎨</span>
						<div>
							<strong>Visual Editor</strong>
							<p>Drag, drop, and customize shapes</p>
						</div>
					</div>
					<div class="feature">
						<span class="icon">🤖</span>
						<div>
							<strong>AI Assistant</strong>
							<p>Describe what you want in words</p>
						</div>
					</div>
					<div class="feature">
						<span class="icon">✏️</span>
						<div>
							<strong>Sketch Input</strong>
							<p>Draw your ideas directly</p>
						</div>
					</div>
				</div>

				<div class="actions">
					<button class="primary-button" onclick={handleStartTutorial}>
						🎓 Take the Tour <span class="time">(2 min)</span>
					</button>
					<button class="secondary-button" onclick={handleBrowseExamples}>
						📚 Browse Examples
					</button>
				</div>

				<button class="skip-link" onclick={handleSkip}>Skip and start creating</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-content {
		background: white;
		border-radius: 16px;
		max-width: 600px;
		width: 90%;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		animation: slideUp 0.3s ease;
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.modal-header {
		padding: 2rem 2rem 1rem;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	h1 {
		margin: 0;
		font-size: 2rem;
		color: #333;
	}

	.close-button {
		background: none;
		border: none;
		font-size: 2rem;
		color: #999;
		cursor: pointer;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.close-button:hover {
		background: #f0f0f0;
		color: #333;
	}

	.modal-body {
		padding: 0 2rem 2rem;
	}

	.tagline {
		font-size: 1.1rem;
		color: #666;
		margin: 0 0 2rem 0;
	}

	.preview {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 12px;
		padding: 3rem;
		margin-bottom: 2rem;
		position: relative;
		overflow: hidden;
	}

	.preview-animation {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		height: 100px;
	}

	.circle {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
	}

	.pulse {
		animation: pulse 2s ease-in-out infinite;
	}

	.delay-1 {
		animation-delay: 0.3s;
	}

	.delay-2 {
		animation-delay: 0.6s;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.6;
		}
		50% {
			transform: scale(1.2);
			opacity: 1;
		}
	}

	.features {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.feature {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		background: #f8f8f8;
		border-radius: 8px;
	}

	.icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.feature strong {
		display: block;
		color: #333;
		margin-bottom: 0.25rem;
	}

	.feature p {
		margin: 0;
		color: #666;
		font-size: 0.9rem;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.primary-button,
	.secondary-button {
		padding: 1rem 1.5rem;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.primary-button {
		background: #0066ff;
		color: white;
	}

	.primary-button:hover {
		background: #0052cc;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
	}

	.secondary-button {
		background: white;
		color: #0066ff;
		border: 2px solid #0066ff;
	}

	.secondary-button:hover {
		background: #f0f7ff;
	}

	.time {
		font-size: 0.85rem;
		opacity: 0.8;
	}

	.skip-link {
		background: none;
		border: none;
		color: #999;
		font-size: 0.9rem;
		cursor: pointer;
		padding: 0.5rem;
		width: 100%;
		text-align: center;
	}

	.skip-link:hover {
		color: #666;
		text-decoration: underline;
	}
</style>
