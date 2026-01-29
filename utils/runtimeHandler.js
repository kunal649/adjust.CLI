const { spawn } = require("child_process"); 
const { loadConfig } = require("./config.js");
const { getRuntimeExecutable } = require("./downloader.js");
const fs = require("fs");
const path = require("path");


async function runFile(file) { 
try {
    if(!fs.existsSync(file)) {
        console.error(`Error: file ${file} not found!`);
        process.exit(1); 
    }

    const config = await loadConfig(); 
    if(!config.activeLanguage) {
        console.log(`Error: No language selected. Run adjust stack <language>`);
        process.exit(1);  
    }
    const language = config.activeLanguage; 
    const executablePath = getRuntimeExecutable(language);
    if(!fs.existsSync(executablePath)){ 
        console.log(`Error: ${language} runtime not found. Run adjust stack <language>. `);
        process.exit(1); 
    }
    console.log(`Running file with ${language}....`); 

     const child_process = spawn(executablePath, [path.resolve(file)], {
        stdio: 'inherit' //we piped all I/O to parent terminal. nice.
     });
 
    child_process.on("close", (code) => {
        if ( code === 0 ){
            console.log(`\n Process completed successfully`); 
        } else {
            console.log(`\n Process exited with code: ${code}`); 
            process.exit(code); 
        }
    }); 

    child_process.on('error', (err) => {
        console.error(`Error spawning process: ${err.message}`);
        process.exit(1);
    }); 
}
    catch (err) { 
        console.log("Error in function runtFile: ", err.message);
        process.exit(1);
    }
}

module.exports = { runFile };