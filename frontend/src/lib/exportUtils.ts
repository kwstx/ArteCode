/**
 * Export Utilities
 * 
 * Create self-contained HTML files for p5.js sketches
 */

/**
 * Generate a complete, self-contained HTML file
 */
export function generateExportHTML(code: string, title: string = 'p5.js Sketch'): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(title)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f0f0f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    main {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    
    canvas {
      display: block;
    }
    
    .info {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.9);
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 12px;
      color: #666;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .info a {
      color: #0066ff;
      text-decoration: none;
    }
    
    .info a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <main id="sketch-container"></main>
  
  <div class="info">
    Created with <a href="https://github.com/yourusername/artecode" target="_blank">ArteCode</a>
  </div>

  <!-- p5.js Library (embedded) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>

  <!-- User Sketch Code -->
  <script>
${indentCode(code, 4)}
  </script>
</body>
</html>`;
}

/**
 * Generate a standalone HTML file with p5.js embedded (no CDN)
 */
export async function generateStandaloneHTML(
    code: string,
    title: string = 'p5.js Sketch'
): Promise<string> {
    // For now, use CDN version
    // In production, you could fetch and embed the full p5.js library
    return generateExportHTML(code, title);
}

/**
 * Escape HTML special characters
 */
function escapeHTML(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Indent code by a number of spaces
 */
function indentCode(code: string, spaces: number): string {
    const indent = ' '.repeat(spaces);
    return code
        .split('\n')
        .map((line) => (line.trim() ? indent + line : ''))
        .join('\n');
}

/**
 * Download a file to the user's computer
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/html') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export sketch as HTML file
 */
export function exportSketch(code: string, filename: string = 'sketch.html') {
    const html = generateExportHTML(code);
    downloadFile(html, filename, 'text/html');
}

/**
 * Generate a safe filename from a title
 */
export function sanitizeFilename(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50) || 'sketch';
}

/**
 * Get export metadata
 */
export function getExportMetadata(code: string) {
    const lines = code.split('\n').length;
    const size = new Blob([generateExportHTML(code)]).size;
    const sizeKB = (size / 1024).toFixed(1);

    return {
        lines,
        size,
        sizeKB,
        hasSetup: code.includes('function setup()'),
        hasDraw: code.includes('function draw()'),
        timestamp: new Date().toISOString()
    };
}
