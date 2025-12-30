/**
 * Validation utilities for backend
 * (Mirrors frontend validation for server-side checks)
 */

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export interface SecurityResult {
    safe: boolean;
    violations: string[];
}

export interface CompatibilityResult {
    compatible: boolean;
    warnings: string[];
}

export interface FullValidationResult {
    valid: boolean;
    safe: boolean;
    compatible: boolean;
    errors: string[];
    violations: string[];
    warnings: string[];
}

/**
 * Validate template compliance
 */
export function validateTemplateCompliance(code: string): ValidationResult {
    const errors: string[] = [];

    if (!code.includes('function setup()')) {
        errors.push('Missing setup() function');
    }

    if (!code.includes('function draw()')) {
        errors.push('Missing draw() function');
    }

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

    if (code.includes('new p5(')) {
        errors.push('Instance mode not allowed - use global mode only');
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Validate security
 */
export function validateSecurity(code: string): SecurityResult {
    const violations: string[] = [];

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
        { pattern: /sessionStorage/gi, message: 'sessionStorage access is not allowed' }
    ];

    for (const { pattern, message } of dangerousPatterns) {
        if (pattern.test(code)) {
            violations.push(message);
        }
    }

    return { safe: violations.length === 0, violations };
}

/**
 * Validate p5.js compatibility
 */
export function validateP5Compatibility(code: string): CompatibilityResult {
    const warnings: string[] = [];

    const p5Functions = [
        'createCanvas',
        'background',
        'fill',
        'stroke',
        'ellipse',
        'rect',
        'line'
    ];

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

    return { compatible: hasP5Functions, warnings };
}

/**
 * Run all validations
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
