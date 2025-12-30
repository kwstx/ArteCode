/**
 * Code Validation Utilities
 * 
 * Validates AI-generated code for template compliance, security, and p5.js compatibility
 */

// ============================================
// TEMPLATE COMPLIANCE VALIDATION
// ============================================

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

/**
 * Validate that code follows the strict template structure
 */
export function validateTemplateCompliance(code: string): ValidationResult {
    const errors: string[] = [];

    // Check for setup function
    if (!code.includes('function setup()')) {
        errors.push('Missing setup() function');
    }

    // Check for draw function
    if (!code.includes('function draw()')) {
        errors.push('Missing draw() function');
    }

    // Check for section comments (either style)
    const hasSetupComment =
        code.includes('// SETUP') || code.includes('// ============================================');
    const hasDrawComment =
        code.includes('// DRAW') || code.includes('// ============================================');

    if (!hasSetupComment) {
        errors.push('Missing SETUP section comment');
    }

    if (!hasDrawComment) {
        errors.push('Missing DRAW section comment');
    }

    // Check for instance mode (not allowed)
    if (code.includes('new p5(')) {
        errors.push('Instance mode not allowed - use global mode only');
    }

    // Check for proper function structure
    if (!code.match(/function\s+setup\s*\(\s*\)\s*\{/)) {
        errors.push('setup() function has incorrect syntax');
    }

    if (!code.match(/function\s+draw\s*\(\s*\)\s*\{/)) {
        errors.push('draw() function has incorrect syntax');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// ============================================
// SECURITY VALIDATION
// ============================================

export interface SecurityResult {
    safe: boolean;
    violations: string[];
}

/**
 * Validate that code doesn't contain unsafe patterns
 */
export function validateSecurity(code: string): SecurityResult {
    const violations: string[] = [];

    // Dangerous patterns that should never be in generated code
    const dangerousPatterns = [
        { pattern: /eval\s*\(/gi, message: 'eval() is not allowed' },
        { pattern: /Function\s*\(/gi, message: 'Function constructor is not allowed' },
        { pattern: /fetch\s*\(/gi, message: 'fetch() is not allowed' },
        { pattern: /XMLHttpRequest/gi, message: 'XMLHttpRequest is not allowed' },
        { pattern: /import\s+/gi, message: 'import statements are not allowed' },
        { pattern: /require\s*\(/gi, message: 'require() is not allowed' },
        { pattern: /\.innerHTML/gi, message: 'innerHTML manipulation is not allowed' },
        { pattern: /document\./gi, message: 'Direct DOM manipulation is not allowed' },
        { pattern: /window\./gi, message: 'Window object access is not allowed' },
        { pattern: /<script/gi, message: 'Script tags are not allowed' },
        { pattern: /localStorage/gi, message: 'localStorage access is not allowed' },
        { pattern: /sessionStorage/gi, message: 'sessionStorage access is not allowed' },
        { pattern: /indexedDB/gi, message: 'indexedDB access is not allowed' }
    ];

    for (const { pattern, message } of dangerousPatterns) {
        if (pattern.test(code)) {
            violations.push(message);
        }
    }

    return {
        safe: violations.length === 0,
        violations
    };
}

// ============================================
// P5.JS COMPATIBILITY VALIDATION
// ============================================

export interface CompatibilityResult {
    compatible: boolean;
    warnings: string[];
}

/**
 * Validate that code uses p5.js functions correctly
 */
export function validateP5Compatibility(code: string): CompatibilityResult {
    const warnings: string[] = [];

    // Common p5.js functions
    const p5Functions = [
        'createCanvas',
        'background',
        'fill',
        'stroke',
        'ellipse',
        'rect',
        'line',
        'triangle',
        'arc',
        'push',
        'pop',
        'translate',
        'rotate',
        'scale'
    ];

    // Check if code uses at least some p5.js functions
    let hasP5Functions = false;
    for (const func of p5Functions) {
        if (code.includes(func)) {
            hasP5Functions = true;
            break;
        }
    }

    if (!hasP5Functions) {
        warnings.push('Code does not appear to use p5.js functions');
    }

    // Check for createCanvas in setup
    if (!code.match(/function\s+setup\s*\([^)]*\)\s*\{[^}]*createCanvas/s)) {
        warnings.push('createCanvas() should be called in setup()');
    }

    // Check for common mistakes
    if (code.includes('canvas.')) {
        warnings.push('Direct canvas manipulation detected - use p5.js functions instead');
    }

    if (code.includes('ctx.')) {
        warnings.push('Direct context manipulation detected - use p5.js functions instead');
    }

    return {
        compatible: hasP5Functions,
        warnings
    };
}

// ============================================
// COMBINED VALIDATION
// ============================================

export interface FullValidationResult {
    valid: boolean;
    safe: boolean;
    compatible: boolean;
    errors: string[];
    violations: string[];
    warnings: string[];
}

/**
 * Run all validations on generated code
 */
export function validateGeneratedCode(code: string): FullValidationResult {
    const templateCheck = validateTemplateCompliance(code);
    const securityCheck = validateSecurity(code);
    const compatibilityCheck = validateP5Compatibility(code);

    return {
        valid: templateCheck.valid,
        safe: securityCheck.safe,
        compatible: compatibilityCheck.compatible,
        errors: templateCheck.errors,
        violations: securityCheck.violations,
        warnings: compatibilityCheck.warnings
    };
}
