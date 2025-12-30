import express from 'express';
import { generateP5Code } from '../services/aiService';
import { validateGeneratedCode } from '../utils/validation';

const router = express.Router();

/**
 * Generate p5.js code from natural language prompt
 */
router.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        // Validate input
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ error: 'Invalid prompt' });
        }

        if (prompt.length > 500) {
            return res.status(400).json({ error: 'Prompt too long (max 500 characters)' });
        }

        // Generate code with Gemini AI
        const code = await generateP5Code(prompt);

        // Validate the generated code
        const validation = validateGeneratedCode(code);

        // Check if code is valid and safe
        if (!validation.valid) {
            return res.status(400).json({
                error: 'Generated code does not comply with template',
                details: validation.errors,
                code // Still return code for debugging
            });
        }

        if (!validation.safe) {
            return res.status(400).json({
                error: 'Generated code contains unsafe patterns',
                details: validation.violations,
                code // Still return code for debugging
            });
        }

        // Return validated code
        res.json({
            code,
            warnings: validation.warnings,
            validated: true
        });
    } catch (error) {
        console.error('AI generation error:', error);
        res.status(500).json({
            error: 'Failed to generate code',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'gemini-ai' });
});

export default router;
