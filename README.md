
[![project status](https://img.shields.io/badge/status-in_progress-yellow.svg)](https://github.com/kunal649/adjust.CLI)
[![language Node.js](https://img.shields.io/badge/language-Node.js-green.svg)](https://nodejs.org/)
![Visitor Count](https://profile-counter.glitch.me/kunal649/count.svg)




# adjust CLI

Im building this CLI as side project. I divided it into checkpoints as mentioned below.
---

## Table of Contents

- [CHECKPOINT 1: Basic CLI Structure](#checkpoint-1-basic-cli-structure)
- [CHECKPOINT 2: Configuration Management](#checkpoint-2-configuration-management)
- [CHECKPOINT 3: Runtime Download & Installation](#checkpoint-3-runtime-download--installation)
- [CHECKPOINT 4: Process Execution](#checkpoint-4-process-execution)
- [CHECKPOINT 5: Dependency Management ( current status )](#checkpoint-5-dependency-management--current-status-)
- [CHECKPOINT 6: Polish & Demo Ready](#checkpoint-6-polish--demo-ready)
- [MANDATORY LEARNING POINTS ACROSS PROJECT](#mandatory-learning-points-across-project)

---

## CHECKPOINT 1: Basic CLI Structure

Build: Command-line interface that accepts and parses commands

Commands to implement:

```bash
adjust select <language>
adjust run <file>
adjust list
```

Topics/Concepts:

<details>
<summary>Click to expand Topics/Concepts</summary>

- Commander.js or Yargs library (argument parsing)
- process.argv basics
- Shebang (#!) for making CLI executable
- npm link for testing CLI locally
- Exit codes and process.exit()

</details>

What I learn: How CLIs work under the hood, argument parsing, making Node scripts executable  
Prerequisites: Basic Node.js, npm packages  
Done when: We can run adjust list and it prints something

---

## CHECKPOINT 2: Configuration Management

Build: Store and retrieve user's selected language/environment

Topics/Concepts:

<details>
<summary>Click to expand Topics/Concepts</summary>

- File system (fs/promises)
- os.homedir() for cross-platform home directory
- path.join() for cross-platform paths
- JSON file storage
- Configuration file patterns

</details>

What I learn: File I/O in Node, persistent storage without databases, cross-platform path handling  
Prerequisites: fs module, async/await  
Done when: adjust select python saves to config file, adjust list reads and shows "Active: python"

---

## CHECKPOINT 3: Runtime Download & Installation

Build: Download Python/Node runtime when first selected

Topics/Concepts:

<details>
<summary>Click to expand Topics/Concepts</summary>

- https module for file downloads
- Streams (readable, writable, pipe)
- Stream events (data, end, error)
- File extraction (tar, zip libraries)
- Progress indicators (cli-progress library)
- Environment variables and PATH manipulation

</details>

What I learn: Network requests in Node without libraries, stream handling, file extraction, managing system PATH  
Prerequisites: Streams, buffers, async operations  
Done when: Running adjust select python downloads Python runtime to ~/.adjust/runtimes/python/ and extracts it

---

## CHECKPOINT 4: Process Execution

Build: Actually run Python/Node files using downloaded runtimes

Topics/Concepts:

<details>
<summary>Click to expand Topics/Concepts</summary>

- child_process.spawn()
- child_process.exec() vs spawn vs fork
- stdio streams (stdin, stdout, stderr)
- Process communication
- Inheriting stdio from parent
- Process exit codes
- Signal handling (SIGINT, SIGTERM)

</details>

What I learn: Process management in Node, spawning child processes, handling process I/O.  
Prerequisites: child_process module, understanding of processes  
Done when: adjust run script.py executes Python file using our managed runtime and shows output in terminal

---

## CHECKPOINT 5: Dependency Management ( current status )

Build: Auto-detect and install dependencies (requirements.txt, package.json)

Topics/Concepts:

<details>
<summary>Click to expand Topics/Concepts</summary>

- File detection (checking if files exist)
- Parsing requirements.txt and package.json
- Spawning pip install / npm install
- Virtual environments (for Python)
- Multiple sequential process spawning
- Process chaining
- Error handling for failed installations

</details>

What I learn: Orchestrating multiple system commands, handling complex async flows, error propagation  
Prerequisites: All previous checkpoints  
Done when: Running adjust run app.py in a folder with requirements.txt automatically installs dependencies first, then runs the file

---

## CHECKPOINT 6: Polish & Demo Ready

Build: Error handling, help messages, README

Topics/Concepts:

<details>
<summary>Click to expand Topics/Concepts</summary>

- Graceful error handling
- User-friendly error messages
- Colorful terminal output (chalk library)
- Writing good READMEs
- Recording terminal demos (asciinema)

</details>

What I learn: Production-ready code practices, documentation  
Done when: Works reliably, has good README, demo video ready

---

## MANDATORY LEARNING POINTS ACROSS PROJECT:

- Streams (i covered em deeply)
- Child processes (spawn, exec, fork differences)
- File system operations (async)
- Cross-platform compatibility (path, os)
- Error handling in async contexts
- Process lifecycle and signal handling

---
