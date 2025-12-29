# ArteCode

A web-based creative coding environment for artists.

## Structure

### `frontend/` (SvelteKit)
- **Role**: Visual Editor, Code Generation UI, Canvas Preview.
- **Rules**:
    - Lives entirely in the browser.
    - No direct filesystem access.
    - No heavy compute (except WebGL/WebGPU).

### `backend/` (Node.js)
- **Role**: AI Model Interface, File Export, Heavy Processing.
- **Rules**:
    - API only.
    - No UI rendering.

## Setup

1. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend**:
   ```bash
   cd backend
   npm install
   npm run start
   ```
