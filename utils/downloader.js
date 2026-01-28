const fs = require("fs"); 
const https = require("https"); 
const path = require("path"); 
const tar = require("tar"); 
const cliProgress = require('cli-progress');

const RUNTIME_DIR = path.join(require("os").homedir(),'.adjust', 'runtimes'); 

const RUNTIMES = {
  python: 'https://www.python.org/ftp/python/3.11.7/Python-3.11.7.tgz',
  node: 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-linux-x64.tar.xz'
}

async function ensureRuntimeDir(language) {  
    try {
        const dir = path.join(RUNTIME_DIR, language)
        await fs.promises.mkdir(dir, {recursive: true}); 
        return dir; 
    }
    catch (err) { console.log(err); }
}

async function downloadRuntime(language) {
    return new Promise(async (resolve, reject) => {
        const url = RUNTIMES[language];
    if (!url) { return reject(new Error(`Unknown language : ${language}`)); }

    const runtimePath = await ensureRuntimeDir(language); 
    const filename = path.basename(url); 
    const filepath = path.join(runtimePath, filename); 

    if (fs.existsSync(filepath)) {
        console.log(`✓ Runtime ${language} already exists`); 
        return resolve(filepath);   // IF TRUE, PROMISE RESOLVED HERE & NO STREAMING NO BUFFERING. 
    }
    console.log(`Downloading runtime ${language}.... (drink some water if you haven't)`);

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey);
    https.get(url, (response) => {
        const totalSize = parseInt(response.headers['content-length'] ,10); 
        let downloadedSize = 0; 

        progressBar.start(totalSize, 0);
        const fileStream = fs.createWriteStream(filepath); 

        response.on('data', (chunks) => {
            downloadedSize += chunks.length; 
            progressBar.update(downloadedSize); 
        });

        response.pipe(fileStream); 

        fileStream.on('finish', () => {
            progressBar.stop();
            fileStream.close();
            console.log(`Successfully downloaded to: ${filepath}`); 
            resolve(filepath);
        });
        fileStream.on('error', (err) => {
            progressBar.stop();
            fileStream.destroy(); 
            fs.unlink(filepath, () => {console.log(`Some anomality, stream and filePath connection destroyed.`)});
    // doubt: why cant I destroy the filestream here? does rejecting promise destroy stream by its own?
            reject(err); 
        }); 
    }).on('error', (err) => {
        progressBar.stop();
        reject(err);
    });
}); 
}

async function extractRuntime(filepath, language) {
    const runtimeDir = path.dirname(filepath);
    const extractDir = path.join(runtimeDir); 

    if (fs.existsSync(extractDir)){
        console.log(`${language} runtime already extracted !`);
        return extractDir; 
    }
    
    console.log(`Extracting ${language} runtime`); 

    await tar.x({
        file: filepath,
        cwd: runtimeDir //doubt -> I guess it should be extractDir, I'll debug it w checkpoint 3.
    });
    // Can I use cli-progress here? umm, ig for that ive to extract using core features, rather than a lib. 
    console.log(`${language} runtime extracted to: ${extractDir}`);
    return extractDir; 
}

async function setupRuntime(language) {
    try {
        const filepath = await downloadRuntime(language); 
        const extractDir = await extractRuntime(filepath, language); 
        return extractDir; 
    } catch (err) {
        throw new Error(`Failed to setup ${language}: ${err.message}, Check Function : setupRunTime`);
    }
}

async function getRuntimePath(language) {
    return path.join(RUNTIME_DIR, language, 'bin');
}

module.exports = { setupRuntime, getRuntimePath }