import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, createUserPrompt } from './aiPrompts';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Generate p5.js code using Google Gemini
 */
export async function generateP5Code(userPrompt: string): Promise<string> {
    try {
        // Get the Gemini model
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Combine system prompt and user prompt
        const fullPrompt = `${SYSTEM_PROMPT}\n\n${createUserPrompt(userPrompt)}`;

        // Generate content
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Extract code from markdown if present
        let code = text.trim();

        // Remove markdown code blocks if present
        if (code.startsWith('```javascript') || code.startsWith('```js')) {
            code = code.replace(/^```(?:javascript|js)\n/, '').replace(/\n```$/, '');
        } else if (code.startsWith('```')) {
            code = code.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        return code.trim();
    } catch (error) {
        console.error('Gemini AI generation error:', error);
        throw new Error('Failed to generate code with Gemini AI');
    }
}

/**
 * Test the Gemini AI connection
 */
export async function testGeminiConnection(): Promise<boolean> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        return !!response.text();
    } catch (error) {
        console.error('Gemini connection test failed:', error);
        return false;
    }
}
