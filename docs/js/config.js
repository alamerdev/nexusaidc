// Configuration
const CONFIG = {
    WORKER_URL: 'https://rapid-dawn-5ec2.alamer.workers.dev',
    API_VERSION: 'v1',
    DEBUG: true
};

const log = (msg, data) => {
    if (CONFIG.DEBUG) {
        console.log(`[NEXUS] ${msg}`, data || '');
    }
};

const err = (msg, data) => {
    console.error(`[NEXUS ERROR] ${msg}`, data || '');
};