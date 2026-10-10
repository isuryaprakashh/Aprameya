
import http from 'http';

function check(path) {
    return new Promise((resolve) => {
        http.get('http://localhost:5000' + path, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`${path}: ${res.statusCode}`);
                resolve();
            });
        }).on('error', (e) => {
            console.log(`${path}: Error ${e.message}`);
            resolve();
        });
    });
}

async function run() {
    console.log("Checking API...");
    await check('/api/projects'); // Should be 200 or 401 (if protected) -> expecting 200 based on code
    await check('/api/db/projects'); // Should be 404
    await check('/api/events'); // Should be 200
    await check('/api/db/event-registrations/user'); // Should be 401 (needs auth) or 404 if missing
    // Add other checks if needed
}

run();
