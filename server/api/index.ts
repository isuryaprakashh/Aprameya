import type { IncomingMessage, ServerResponse } from 'http';
import { app, registerRoutes } from '../index';
import { connectDB } from '../db';

// Initialize DB and routes once
let initialized = false;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    if (!initialized) {
        await connectDB();
        await registerRoutes(app);
        initialized = true;
    }

    app(req as any, res as any);
}
