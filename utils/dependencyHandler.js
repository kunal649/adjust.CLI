// 1. How would you check if requirements.txt exists in same directory as the script?
const fs = require("fs");
const path = require("node:path");
const {spawn} = require("child_process"); 

const currentDir = process.cwd(); 
if (language === 'python'){
    const reqPyFile = path.join(currentDir, 'requirements.txt'); 
    if(!fs.existsSync(reqPyFile)) {
    console.log("No libraries, modules detected. Make sure your project's root directory has : requirements.txt");
    const pyFile = fs.readFile(reqPyFile, 'utf8'); 
    return pyFile;
}
}
else {
    const reqNodeFile = path.join(currentDir, 'package.json'); 
    if(!fs.existsSync(reqNodeFile)) {
    console.log('No libraries, modules detected. Make sure your project root directory has "package.json"');
    const nodeFile = fs.readFile(reqNodeFile, 'utf8');
    return nodeFile;
}
}


// 2. If it exists, how would you run: pip install -r requirements.txt
//    using the pip that came with your downloaded Python?

const child_process = spawn()

// 3. How would you wait for pip to finish BEFORE running the script?

// 4. What if pip install fails? Should you still run the script?

// 5. Where is pip.exe located relative to python.exe?