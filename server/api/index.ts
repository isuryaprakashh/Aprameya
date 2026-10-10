import type { IncomingMessage, ServerResponse } from 'http';
import { app, registerRoutes } from '../index';

// Initialize routes once
let routesRegistered = false;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    if (!routesRegistered) {
        await registerRoutes(app);
        routesRegistered = true;
    }

    app(req as any, res as any);
}
