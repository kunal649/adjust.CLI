#!/usr/bin/env node
const { Command } = require('commander');
const { saveConfig, loadConfig} = require('./utils/config'); 
const {setupRuntime, getRuntimePath, getRuntimeExecutable} = require('./utils/downloader.js');
const { runFile } = require("./utils/runtimeHandler.js");  
const program = new Command(); 

program
    .name('adjust')
    .description('CLI to manage environments')
    .version('1.0.0');

program
    .command('me')
    .description('Let me handle the heavy liftings for you... \n Downloading dependencies...')
    .action(async () => {
        console.log("Downloading assets...")
    }); 

program
    .command('stack <language>')
    .description('Select a language environment (python, node, golang)')
    .action(async (language) => { 
        if(!['python', 'node'].includes(language)){
            console.log("Supported languages: python, node, golang"); 
            return;
        } 

        console.log("Setting up languages...");
    try { 
        await setupRuntime(language);
        getRuntimeExecutable(language);  
        const config = await loadConfig();
        config.activeLanguage = language;  
        config.environment[language] = {
            path: getRuntimePath(language),
            installed_at: new Date().toISOString()
        }
        await saveConfig(config); 
        console.log(`Selected: ${language}. Now ready to use!`);
    }
    catch (err) {
         console.error(`Failed to setup ${language}:`, err.message);
    }
    });

program 
    .command('list')
    .description('List available & active runtimes')
    .action(async () => {
        const list = await loadConfig(); 
        console.log(`Available runtimes: ${list.activeLanguage}`);
        console.log(`Environment status: ${list.environment}`); 
    }); 

program
    .command('run <file>')
    .description('Run a file with selected envirnonment')
    .action(async (file) => {
        await runFile(file); 
        console.log(`Running ${file}`); 
    });
    
program.parse();

