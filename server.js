#!/usr/bin/env node
const { Command } = require('commander');
const { saveConfig, loadConfig} = require('./config'); 

const program = new Command(); 

program
    .name('adjust')
    .description('CLI to manage environments')
    .version('1.0.0');

program
    .command('stack <language>')
    .description('Select a language environment (python, node, golang)')
    .action(async (language) => { 
        const config = await loadConfig();
        config.activeLanguage = language; 
        await saveConfig(config); 
        console.log(`Selected: ${language}`);
    });

program 
    .command('list')
    .description('List available & active runtimes')
    .action(() => {
        console.log('Available runtimes: Node, python, golang');
        console.log('Active: none'); 
    }); 

program
    .command('run <file>')
    .description('Run a file with selected envirnonment')
    .action((file) => {
        console.log(`Running ${file}`); 
    });
    
program.parse();

