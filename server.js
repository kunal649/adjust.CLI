#!/usr/bin/env node
const { Command } = require('commander');
const { saveConfig, loadConfig} = require('./utils/config'); 

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
        const config = await loadConfig();
        config.activeLanguage = language;  // Doubt 
        config.environment = 'In development'
        await saveConfig(config); 
        console.log(`Selected: ${language}`);
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
    .action((file) => {
        console.log(`Running ${file}`); 
    });
    
program.parse();

