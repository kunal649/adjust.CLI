// 1. How would you check if requirements.txt exists in same directory as the script?
const fs = require("fs");
const path = require("node:path");
const {spawn} = require("child_process"); 
const { getExecutable } = require("./downloader.js"); 

function getDependencyManager(language) {
    const langPath = getExecutable(language); 
    const runtimePath = path.dirname(langPath); 

    if (language === 'python'){
    return langPath; 
    } else if(language === 'node') {
        return process.platform === 'win32'
            ? path.join(runtimePath, 'npm.cmd')
            : path.join(runtimePath, 'npm');
    }
    throw new Error(`Unknown Language:${language}`); 
} 

function installDependencies(language, scriptDir) {    
let depFile, command, args; 
if (language === 'python') {
    depFile = path.join(scriptDir, 'requirements.txt'); 
        if (!fs.existsSync(depFile)) {
            console.log('No requirements.txt found, skipping dependency installation');
            return true; 
        }
    command = getDependencyManager(language);
    args = ['-m', 'pip', 'install', '-r', depFile]; 
} else if (language === 'node') {
    depFile = path.join(scriptDir, 'package.json'); 
        if (!fs.existsSync(depFile)) {
            console.log('No package.json found, skipping dependency installation'); 
            return true; 
        } 
    command = getDependencyManager(language); 
    args = ['install']; 
}

console.log(`${depFile} found.... Installing dependencies`); 

return new Promise((resolve, reject) => {
const install_process = spawn(command, args, {
        cwd: scriptDir,
        stdio: 'inherit'
     });
install_process.on("close", (code) => {
    if(code === '0') { console.log('Dependencies installed successfully. \n'); return resolve(true); }
    else { console.log(`Dependencies installation failed with code : ${code}`); }
}); 

install_process.on('error', (err) => {
    console.error(`Error running dependency manager: ${err.message}`);
    reject(err);
}); 
}); 
}

module.exports = { getDependencyManager, installDependencies}

// 3. How would you wait for pip to finish BEFORE running the script?

// 4. What if pip install fails? Should you still run the script?

// 5. Where is pip.exe located relative to python.exe?