const fs = require("fs").promises;  // Doubt 
const path = require("path"); 
const os = require("os");

const CONFIG_DIR = path.join(os.homedir(), '.adjust');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json'); 

async function ensureConfigDir() {
    try {
        await fs.mkdir(CONFIG_DIR, {recursive: true}); 
    } catch (err) {
        console.log('Failed to create new directory.', err); 
    }
}

async function saveConfig(data) {
    await ensureConfigDir();
    await fs.writeFile(CONFIG_FILE, JSON.stringify(data, null, 2), 'utf8'); //Doubt1: I should use stream instead.
}

async function loadConfig() {
    try {
        const data = await fs.readFile(CONFIG_FILE, 'utf8'); //Doubt - Streams preferred!
        return JSON.parse(data); 
    } catch (Err) {
        return { activeLanguage: null, environment: {} }; 
    }
}

module.exports = { saveConfig, loadConfig}; 