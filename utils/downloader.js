const fs = require("fs"); 
const https = require("https"); 
const path = require("path"); 
const tar = require("tar"); 
const cliProgress = require('cli-progress');
const redirectHandler = require("./httpsHandler.js");
const AdmZip = require("adm-zip"); 
const platform = require("os").platform(); 
const RUNTIME_DIR = path.join(require("os").homedir(),'.adjust', 'runtimes'); 

const RUNTIMES = {
  python: platform === 'win32' 
    ? 'https://www.python.org/ftp/python/3.11.7/python-3.11.7-embed-amd64.zip'
    : 'https://www.python.org/ftp/python/3.11.7/Python-3.11.7.tgz',
  node: platform === 'win32'
    ? 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-win-x64.zip'
    : 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-linux-x64.tar.xz'
};

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

    const dir = await ensureRuntimeDir(language); 
    const filename = path.basename(url); 
    const filepath = path.join(dir, filename); 

    if (fs.existsSync(filepath)) {
        console.log(`✓ Runtime ${language} already exists`); 
        return resolve(filepath);   // IF TRUE, PROMISE RESOLVED HERE & NO STREAMING NO BUFFERING. 
    }
    console.log(`Downloading runtime ${language}.... (drink some water if you haven't)`);

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

https.get(url, (response) => {
    redirectHandler(response); 
    handleresponse(response); 

    function handleresponse(res){
        const totalSize = parseInt(res.headers['content-length'] ,10); 
        let downloadedSize = 0; 

        progressBar.start(totalSize, 0);
        const fileStream = fs.createWriteStream(filepath); 

        res.on('data', (chunks) => {
            downloadedSize += chunks.length; 
            progressBar.update(downloadedSize); 
        });

        res.pipe(fileStream); 

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
            reject(err); 
        }); 
    }
    }).on('error', (err) => {
        progressBar.stop();
        reject(err);
    });
}); 
}

async function extractRuntime(filepath, language) {
    const downloadedDir = path.dirname(filepath);
    const extractDir = path.join(downloadedDir, 'bin'); 

    if (fs.existsSync(extractDir)){
        console.log(`${language} runtime already extracted !`);
        return extractDir; 
    }
    
    await fs.promises.mkdir(extractDir, {recursive: true});
    console.log(`Extracting ${language} runtime......`); 

    const ext = path.extname(filepath); 
    if (ext === '.zip') {
        const zip = new AdmZip(filepath);
        zip.extractAllTo(extractDir, true);
        console.log(`✓ Extracted to: ${extractDir}`);
    } else if (ext === '.tgz' || ext === '.gz') {
        await tar.x({
           file: filepath,
           cwd: extractDir 
    });
// Can I use cli-progress here? umm, ig for that ive to extract using core features, rather than a lib. 
        console.log(`${language} runtime extracted to: ${extractDir}`);
    }
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

function getRuntimePath(language) {
    return path.join(RUNTIME_DIR, language, 'bin');
}

function getRuntimeExecutable(language) {
  const runtimePath = getRuntimePath(language);
  
  if (language === 'python') {
    return platform === 'win32' 
      ? path.join(runtimePath, 'python.exe')
      : path.join(runtimePath, 'python3');
  } else if (language === 'node') {
    return platform === 'win32'
      ? path.join(runtimePath, 'node.exe')
      : path.join(runtimePath, 'node');
  }
  
  throw new Error(`Unknown language: ${language}`);
}


module.exports = { setupRuntime, getRuntimePath, getRuntimeExecutable }