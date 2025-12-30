/**
 * Onboarding State Management
 * 
 * Track user progress and manage progressive disclosure
 */

export interface OnboardingProgress {
    hasVisited: boolean;
    hasCompletedTutorial: boolean;
    hasEditedElement: boolean;
    hasUsedAI: boolean;
    hasDrawnSketch: boolean;
    hasAddedEffect: boolean;
    hasExported: boolean;
    elementsCreated: number;
    aiGenerations: number;
    sketchesDrawn: number;
    effectsApplied: number;
    exportsCompleted: number;
    lastVisit: string;
}

const STORAGE_KEY = 'artecode_onboarding';

/**
 * Get onboarding progress from localStorage
 */
export function getOnboardingProgress(): OnboardingProgress {
    if (typeof window === 'undefined') {
        return getDefaultProgress();
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return getDefaultProgress();
    }

    try {
        return JSON.parse(stored);
    } catch {
        return getDefaultProgress();
    }
}

/**
 * Save onboarding progress to localStorage
 */
export function saveOnboardingProgress(progress: OnboardingProgress): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/**
 * Get default onboarding progress
 */
function getDefaultProgress(): OnboardingProgress {
    return {
        hasVisited: false,
        hasCompletedTutorial: false,
        hasEditedElement: false,
        hasUsedAI: false,
        hasDrawnSketch: false,
        hasAddedEffect: false,
        hasExported: false,
        elementsCreated: 0,
        aiGenerations: 0,
        sketchesDrawn: 0,
        effectsApplied: 0,
        exportsCompleted: 0,
        lastVisit: new Date().toISOString()
    };
}

/**
 * Mark first visit
 */
export function markFirstVisit(): void {
    const progress = getOnboardingProgress();
    progress.hasVisited = true;
    progress.lastVisit = new Date().toISOString();
    saveOnboardingProgress(progress);
}

/**
 * Mark tutorial completed
 */
export function markTutorialCompleted(): void {
    const progress = getOnboardingProgress();
    progress.hasCompletedTutorial = true;
    saveOnboardingProgress(progress);
}

/**
 * Track element creation
 */
export function trackElementCreated(): void {
    const progress = getOnboardingProgress();
    progress.hasEditedElement = true;
    progress.elementsCreated++;
    saveOnboardingProgress(progress);
}

/**
 * Track AI generation
 */
export function trackAIGeneration(): void {
    const progress = getOnboardingProgress();
    progress.hasUsedAI = true;
    progress.aiGenerations++;
    saveOnboardingProgress(progress);
}

/**
 * Track sketch drawn
 */
export function trackSketchDrawn(): void {
    const progress = getOnboardingProgress();
    progress.hasDrawnSketch = true;
    progress.sketchesDrawn++;
    saveOnboardingProgress(progress);
}

/**
 * Track effect applied
 */
export function trackEffectApplied(): void {
    const progress = getOnboardingProgress();
    progress.hasAddedEffect = true;
    progress.effectsApplied++;
    saveOnboardingProgress(progress);
}

/**
 * Track export completed
 */
export function trackExportCompleted(): void {
    const progress = getOnboardingProgress();
    progress.hasExported = true;
    progress.exportsCompleted++;
    saveOnboardingProgress(progress);
}

/**
 * Check if user is new (first visit)
 */
export function isNewUser(): boolean {
    return !getOnboardingProgress().hasVisited;
}

/**
 * Check if user should see tutorial
 */
export function shouldShowTutorial(): boolean {
    const progress = getOnboardingProgress();
    return !progress.hasCompletedTutorial && progress.hasVisited;
}

/**
 * Get current onboarding level (1-5)
 */
export function getOnboardingLevel(): number {
    const progress = getOnboardingProgress();

    if (!progress.hasEditedElement) return 1; // Visual editor only
    if (!progress.hasUsedAI && progress.elementsCreated < 3) return 1;
    if (!progress.hasUsedAI) return 2; // Unlock AI
    if (!progress.hasDrawnSketch && progress.aiGenerations < 2) return 2;
    if (!progress.hasDrawnSketch) return 3; // Unlock sketch
    if (!progress.hasAddedEffect && progress.elementsCreated < 5) return 3;
    if (!progress.hasAddedEffect) return 4; // Unlock effects
    return 5; // Full interface
}

/**
 * Get milestone message for current achievement
 */
export function getMilestoneMessage(action: string): string | null {
    const progress = getOnboardingProgress();

    switch (action) {
        case 'elementCreated':
            if (progress.elementsCreated === 1) return '🎉 First element created!';
            if (progress.elementsCreated === 5) return '🌟 5 elements created!';
            if (progress.elementsCreated === 10) return '🏆 10 elements created!';
            break;

        case 'aiGeneration':
            if (progress.aiGenerations === 1) return '🎨 First AI generation!';
            if (progress.aiGenerations === 5) return '🤖 5 AI generations!';
            break;

        case 'sketchDrawn':
            if (progress.sketchesDrawn === 1) return '✏️ First sketch drawn!';
            break;

        case 'effectApplied':
            if (progress.effectsApplied === 1) return '✨ First effect applied!';
            break;

        case 'exportCompleted':
            if (progress.exportsCompleted === 1) return '📦 First export completed!';
            break;
    }

    // Check for master achievement
    if (
        progress.hasEditedElement &&
        progress.hasUsedAI &&
        progress.hasDrawnSketch &&
        progress.hasAddedEffect &&
        progress.hasExported
    ) {
        return '🏆 ArteCode Master! You\'ve used all features!';
    }

    return null;
}
