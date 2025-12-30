# ArteCode Backend - Gemini AI Integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your Gemini API key to `.env`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into your `.env` file

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## API Endpoints

### Generate Code
```
POST /api/ai/generate
Content-Type: application/json

{
  "prompt": "Create a bouncing ball"
}
```

Response:
```json
{
  "code": "// Generated p5.js code...",
  "warnings": [],
  "validated": true
}
```

### Health Check
```
GET /api/ai/health
```

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
