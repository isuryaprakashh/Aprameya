import { app, registerRoutes } from '../server/index';

// Initialize routes once
let routesRegistered = false;

export default async function handler(req: any, res: any) {
    if (!routesRegistered) {
        await registerRoutes(app);
        routesRegistered = true;
    }

    app(req, res);
}
