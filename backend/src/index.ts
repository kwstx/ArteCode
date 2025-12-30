import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'artecode-backend' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ArteCode backend running on port ${PORT}`);
    console.log(`📡 AI endpoint: http://localhost:${PORT}/api/ai/generate`);
});
