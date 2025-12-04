import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

interface RyoTerminalConfig {
    name: string;
    directory: string;
    command: string;
    color?: string;
    icon?: string;
    autoStart?: boolean;
    delay?: number; // delay in ms before running command
}

interface RyoSetupConfig {
    name: string;
    description?: string;
    version?: string;
    terminals: RyoTerminalConfig[];
    environment?: Record<string, string>;
}

interface PresetTemplate {
    label: string;
    description: string;
    detail: string;
    icon: string;
    config: RyoSetupConfig;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const activeTerminals: Map<string, vscode.Terminal> = new Map();
let isRunning = false;
let statusBarItem: vscode.StatusBarItem;
let currentConfig: RyoSetupConfig | null = null;

// Terminal colors for VS Code
const TERMINAL_COLORS = [
    'terminal.ansiRed',
    'terminal.ansiGreen', 
    'terminal.ansiYellow',
    'terminal.ansiBlue',
    'terminal.ansiMagenta',
    'terminal.ansiCyan',
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRESET TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

const PRESET_TEMPLATES: PresetTemplate[] = [
    {
        label: "$(zap) Laravel Fullstack",
        description: "Laravel + Vite/Mix",
        detail: "npm run dev + php artisan serve",
        icon: "zap",
        config: {
            name: "Laravel Fullstack",
            description: "Laravel with Vite/Mix frontend",
            terminals: [
                { name: "Frontend", directory: ".", command: "npm run dev", icon: "browser", color: "terminal.ansiGreen" },
                { name: "Backend", directory: ".", command: "php artisan serve", icon: "server", color: "terminal.ansiBlue" }
            ]
        }
    },
    {
        label: "$(rocket) Next.js + Express",
        description: "Next.js Frontend + Express Backend",
        detail: "Separate frontend & backend directories",
        icon: "rocket",
        config: {
            name: "Next.js + Express",
            description: "Next.js with Express API",
            terminals: [
                { name: "Next.js", directory: "./frontend", command: "npm run dev", icon: "browser", color: "terminal.ansiCyan" },
                { name: "Express", directory: "./backend", command: "npm run dev", icon: "server", color: "terminal.ansiYellow" }
            ]
        }
    },
    {
        label: "$(flame) React + Laravel API",
        description: "React SPA + Laravel Backend",
        detail: "Separate React & Laravel projects",
        icon: "flame",
        config: {
            name: "React + Laravel",
            description: "React SPA with Laravel API",
            terminals: [
                { name: "React", directory: "./frontend", command: "npm start", icon: "browser", color: "terminal.ansiCyan" },
                { name: "Laravel", directory: "./backend", command: "php artisan serve", icon: "server", color: "terminal.ansiRed" }
            ]
        }
    },
    {
        label: "$(pulse) Vue + Django",
        description: "Vue.js + Django REST Framework",
        detail: "Vue frontend with Django backend",
        icon: "pulse",
        config: {
            name: "Vue + Django",
            description: "Vue.js with Django REST API",
            terminals: [
                { name: "Vue", directory: "./frontend", command: "npm run serve", icon: "browser", color: "terminal.ansiGreen" },
                { name: "Django", directory: "./backend", command: "python manage.py runserver", icon: "server", color: "terminal.ansiYellow" }
            ]
        }
    },
    {
        label: "$(beaker) MERN Stack",
        description: "MongoDB + Express + React + Node",
        detail: "Full MERN stack development",
        icon: "beaker",
        config: {
            name: "MERN Stack",
            description: "MongoDB, Express, React, Node.js",
            terminals: [
                { name: "React", directory: "./client", command: "npm start", icon: "browser", color: "terminal.ansiCyan" },
                { name: "Express", directory: "./server", command: "npm run dev", icon: "server", color: "terminal.ansiGreen" },
                { name: "MongoDB", directory: ".", command: "mongod", icon: "database", color: "terminal.ansiYellow", autoStart: false }
            ]
        }
    },
    {
        label: "$(cloud) Microservices",
        description: "Multiple services setup",
        detail: "Run multiple microservices simultaneously",
        icon: "cloud",
        config: {
            name: "Microservices",
            description: "Multiple microservices architecture",
            terminals: [
                { name: "Gateway", directory: "./gateway", command: "npm run dev", icon: "globe", color: "terminal.ansiBlue" },
                { name: "Auth Service", directory: "./auth-service", command: "npm run dev", icon: "key", color: "terminal.ansiGreen" },
                { name: "User Service", directory: "./user-service", command: "npm run dev", icon: "person", color: "terminal.ansiYellow" },
                { name: "API Service", directory: "./api-service", command: "npm run dev", icon: "server", color: "terminal.ansiMagenta" }
            ]
        }
    },
    {
        label: "$(tools) Docker Compose",
        description: "Docker-based development",
        detail: "Run docker-compose up with logs",
        icon: "tools",
        config: {
            name: "Docker Development",
            description: "Docker Compose based setup",
            terminals: [
                { name: "Docker", directory: ".", command: "docker-compose up", icon: "package", color: "terminal.ansiBlue" },
                { name: "Logs", directory: ".", command: "docker-compose logs -f", icon: "output", color: "terminal.ansiGreen", delay: 3000 }
            ]
        }
    },
    {
        label: "$(heart) Custom Setup",
        description: "Create your own configuration",
        detail: "Define custom terminals and commands",
        icon: "heart",
        config: {
            name: "Custom",
            description: "Custom configuration",
            terminals: []
        }
    }
];

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVATION
// ═══════════════════════════════════════════════════════════════════════════════

export function activate(context: vscode.ExtensionContext) {
    console.log('Ryo-Dev is now active!');

    // Create status bar
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    updateStatusBar();
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Register commands
    const commands = [
        vscode.commands.registerCommand('extension.toggleRyoDevServe', toggleRyoDev),
        vscode.commands.registerCommand('ryodev.start', showStartMenu),
        vscode.commands.registerCommand('ryodev.stop', stopAllTerminals),
        vscode.commands.registerCommand('ryodev.createConfig', createRyoSetupConfig),
        vscode.commands.registerCommand('ryodev.editConfig', editRyoSetupConfig),
        vscode.commands.registerCommand('ryodev.showTerminals', showActiveTerminals),
        vscode.commands.registerCommand('ryodev.restartTerminal', restartTerminal),
        vscode.commands.registerCommand('ryodev.quickStart', quickStart),
        vscode.commands.registerCommand('ryodev.presets', showPresets),
    ];

    commands.forEach(cmd => context.subscriptions.push(cmd));

    // Watch for terminal close
    vscode.window.onDidCloseTerminal(terminal => {
        for (const [key, t] of activeTerminals.entries()) {
            if (t === terminal) {
                activeTerminals.delete(key);
                break;
            }
        }
        if (activeTerminals.size === 0) {
            isRunning = false;
            updateStatusBar();
        }
    });

    // Auto-detect ryosetup on activation
    autoDetectConfig();
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS BAR
// ═══════════════════════════════════════════════════════════════════════════════

function updateStatusBar() {
    if (isRunning) {
        const count = activeTerminals.size;
        statusBarItem.text = `$(debug-stop) Ryo Dev (${count})`;
        statusBarItem.tooltip = `Click to stop ${count} running terminal(s)\n\nRight-click for more options`;
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    } else {
        statusBarItem.text = "$(play) Ryo Dev";
        statusBarItem.tooltip = "Click to start development servers\n\nRight-click for more options";
        statusBarItem.backgroundColor = undefined;
    }
    statusBarItem.command = "extension.toggleRyoDevServe";
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN MENU
// ═══════════════════════════════════════════════════════════════════════════════

async function toggleRyoDev() {
    if (isRunning) {
        await showStopMenu();
    } else {
        await showStartMenu();
    }
}

async function showStartMenu() {
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    
    interface StartMenuItem extends vscode.QuickPickItem {
        action: string;
    }
    
    const items: StartMenuItem[] = [
        { label: "$(zap) Quick Start", description: "Laravel: npm run dev + php artisan serve", detail: "Fast start for Laravel projects", action: "quickstart" },
        { label: "$(file-code) From ryosetup.json", description: "Load configuration from file", detail: "Use existing ryosetup.json configuration", action: "fromconfig" },
        { label: "$(list-unordered) Choose Preset", description: "Select from preset templates", detail: "Laravel, Next.js, React, Vue, MERN, etc.", action: "presets" },
        { label: "$(add) Create New Config", description: "Create ryosetup.json interactively", detail: "Step-by-step configuration wizard", action: "create" },
    ];

    // Check if config exists
    if (workspacePath) {
        const configPath = findRyoSetupFile(workspacePath);
        if (configPath) {
            items[1].description = `Found: ${path.basename(configPath)}`;
        } else {
            items[1].description = "No config found - will create one";
        }
    }

    const selection = await vscode.window.showQuickPick(items, {
        placeHolder: "🚀 How would you like to start?",
        title: "Ryo Dev - Start Development",
        matchOnDescription: true,
        matchOnDetail: true
    });

    if (!selection) { return; }

    switch (selection.action) {
        case "quickstart":
            await quickStart();
            break;
        case "fromconfig":
            await startFromConfig();
            break;
        case "presets":
            await showPresets();
            break;
        case "create":
            await createRyoSetupConfig();
            break;
    }
}

async function showStopMenu() {
    interface StopMenuItem extends vscode.QuickPickItem {
        action: string;
    }
    
    const items: StopMenuItem[] = [
        { label: "$(debug-stop) Stop All", description: `Stop all ${activeTerminals.size} terminals`, action: "stopall" },
        { label: "$(refresh) Restart All", description: "Restart all terminals", action: "restartall" },
        { label: "$(list-selection) Manage Terminals", description: "View and manage individual terminals", action: "manage" },
    ];

    const selection = await vscode.window.showQuickPick(items, {
        placeHolder: `${activeTerminals.size} terminal(s) running`,
        title: "Ryo Dev - Running"
    });

    if (!selection) { return; }

    switch (selection.action) {
        case "stopall":
            await stopAllTerminals();
            break;
        case "restartall":
            await restartAllTerminals();
            break;
        case "manage":
            await showActiveTerminals();
            break;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUICK START
// ═══════════════════════════════════════════════════════════════════════════════

async function quickStart() {
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return;
    }

    // Try to auto-detect project type
    const projectType = await detectProjectType(workspacePath);
    
    let config: RyoSetupConfig;
    
    if (projectType) {
        const preset = PRESET_TEMPLATES.find(p => p.config.name.toLowerCase().includes(projectType.toLowerCase()));
        if (preset) {
            config = JSON.parse(JSON.stringify(preset.config));
            vscode.window.showInformationMessage(`Detected ${projectType} project. Using ${preset.label} preset.`);
        } else {
            config = getDefaultConfig();
        }
    } else {
        config = getDefaultConfig();
    }

    await startWithConfig(config, workspacePath);
}

function getDefaultConfig(): RyoSetupConfig {
    return {
        name: "Quick Start",
        terminals: [
            { name: "Dev", directory: ".", command: "npm run dev", icon: "browser", color: "terminal.ansiGreen" },
            { name: "Serve", directory: ".", command: "php artisan serve", icon: "server", color: "terminal.ansiBlue" }
        ]
    };
}

async function detectProjectType(workspacePath: string): Promise<string | null> {
    try {
        const files = fs.readdirSync(workspacePath);
        
        // Check for specific framework files
        if (files.includes('artisan') && files.includes('composer.json')) {
            if (files.includes('package.json')) {
                const packageJson = JSON.parse(fs.readFileSync(path.join(workspacePath, 'package.json'), 'utf-8'));
                if (packageJson.dependencies?.['react'] || packageJson.devDependencies?.['react']) {
                    return 'React + Laravel';
                }
                if (packageJson.dependencies?.['vue'] || packageJson.devDependencies?.['vue']) {
                    return 'Vue + Laravel';
                }
            }
            return 'Laravel Fullstack';
        }
        
        if (files.includes('next.config.js') || files.includes('next.config.mjs')) {
            return 'Next.js';
        }
        
        if (files.includes('nuxt.config.js') || files.includes('nuxt.config.ts')) {
            return 'Nuxt';
        }
        
        if (files.includes('docker-compose.yml') || files.includes('docker-compose.yaml')) {
            return 'Docker';
        }

        if (files.includes('manage.py')) {
            return 'Django';
        }

        // Check subdirectories for monorepo
        const hasClientOrFrontend = files.includes('client') || files.includes('frontend');
        const hasServerOrBackend = files.includes('server') || files.includes('backend');
        
        if (hasClientOrFrontend && hasServerOrBackend) {
            return 'Monorepo';
        }

    } catch (error) {
        console.error('Error detecting project type:', error);
    }
    
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIG FILE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function startFromConfig() {
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return;
    }

    const configPath = findRyoSetupFile(workspacePath);
    
    if (!configPath) {
        const create = await vscode.window.showWarningMessage(
            'No ryosetup.json found. Would you like to create one?',
            'Create', 'Use Preset', 'Cancel'
        );
        
        if (create === 'Create') {
            await createRyoSetupConfig();
        } else if (create === 'Use Preset') {
            await showPresets();
        }
        return;
    }

    try {
        const config = parseRyoSetupFile(configPath, workspacePath);
        await startWithConfig(config, workspacePath);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error parsing config: ${error.message}`);
    }
}

function findRyoSetupFile(directory: string): string | undefined {
    try {
        const files = fs.readdirSync(directory);
        // Support multiple file formats
        const configFiles = ['ryosetup.json', 'ryosetup.jsonc', '.ryosetup.json', 'ryosetup'];
        
        for (const configFile of configFiles) {
            if (files.includes(configFile)) {
                return path.join(directory, configFile);
            }
        }
        
        // Legacy support - find any file starting with 'ryosetup'
        const legacyFile = files.find(file => file.toLowerCase().startsWith('ryosetup'));
        return legacyFile ? path.join(directory, legacyFile) : undefined;
    } catch (error) {
        console.error('Error finding ryosetup file:', error);
        return undefined;
    }
}

function parseRyoSetupFile(filePath: string, workspacePath: string): RyoSetupConfig {
    const content = fs.readFileSync(filePath, 'utf-8');
    const ext = path.extname(filePath).toLowerCase();
    
    // Try JSON parsing first
    if (ext === '.json' || ext === '.jsonc' || content.trim().startsWith('{')) {
        try {
            // Remove comments for JSONC
            const cleanContent = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
            const config: RyoSetupConfig = JSON.parse(cleanContent);
            
            // Validate and normalize paths
            config.terminals = config.terminals.map(t => ({
                ...t,
                directory: path.resolve(workspacePath, t.directory || '.')
            }));
            
            return config;
        } catch (e) {
            throw new Error(`Invalid JSON in ${path.basename(filePath)}`);
        }
    }
    
    // Legacy plain text format support
    const lines = content.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    
    if (lines.length >= 4) {
        return {
            name: "Legacy Config",
            terminals: [
                { 
                    name: "Frontend", 
                    directory: path.resolve(workspacePath, lines[0]), 
                    command: lines[2],
                    color: "terminal.ansiGreen"
                },
                { 
                    name: "Backend", 
                    directory: path.resolve(workspacePath, lines[1]), 
                    command: lines[3],
                    color: "terminal.ansiBlue"
                }
            ]
        };
    }
    
    throw new Error('Invalid ryosetup file format');
}

async function autoDetectConfig() {
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) { return; }

    const configPath = findRyoSetupFile(workspacePath);
    if (configPath) {
        try {
            currentConfig = parseRyoSetupFile(configPath, workspacePath);
            console.log(`Ryo-Dev: Loaded config "${currentConfig.name}"`);
        } catch (error) {
            console.error('Error loading config:', error);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRESET TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

async function showPresets() {
    const items = PRESET_TEMPLATES.map(preset => ({
        label: preset.label,
        description: preset.description,
        detail: preset.detail,
        preset: preset
    }));

    const selection = await vscode.window.showQuickPick(items, {
        placeHolder: "Select a preset template",
        title: "Ryo Dev - Presets",
        matchOnDescription: true,
        matchOnDetail: true
    });

    if (!selection) { return; }

    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return;
    }

    if (selection.preset.config.name === "Custom") {
        await createRyoSetupConfig();
        return;
    }

    // Ask if user wants to save this preset
    const save = await vscode.window.showQuickPick([
        { label: "$(play) Run Now", description: "Start without saving", action: "run" },
        { label: "$(save) Save & Run", description: "Save as ryosetup.json and run", action: "saverun" },
        { label: "$(edit) Edit & Save", description: "Customize before saving", action: "edit" }
    ], {
        placeHolder: "What would you like to do?",
        title: selection.preset.label
    });

    if (!save) { return; }

    let config = JSON.parse(JSON.stringify(selection.preset.config));

    if (save.action === "edit") {
        config = await editConfigInteractively(config);
        if (!config) { return; }
    }

    if (save.action === "saverun" || save.action === "edit") {
        await saveConfig(config, workspacePath);
    }

    await startWithConfig(config, workspacePath);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIG CREATION & EDITING
// ═══════════════════════════════════════════════════════════════════════════════

async function createRyoSetupConfig() {
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return;
    }

    const config: RyoSetupConfig = {
        name: "",
        description: "",
        terminals: []
    };

    // Step 1: Project name
    const name = await vscode.window.showInputBox({
        prompt: "Project name",
        placeHolder: "My Awesome Project",
        value: path.basename(workspacePath)
    });
    if (!name) { return; }
    config.name = name;

    // Step 2: Description
    const description = await vscode.window.showInputBox({
        prompt: "Project description (optional)",
        placeHolder: "A brief description of your project"
    });
    config.description = description || "";

    // Step 3: Add terminals
    let addMore = true;
    let terminalIndex = 1;

    while (addMore) {
        const terminal = await addTerminalInteractively(workspacePath, terminalIndex);
        if (terminal) {
            config.terminals.push(terminal);
            terminalIndex++;
        }

        if (config.terminals.length > 0) {
            const more = await vscode.window.showQuickPick([
                { label: "$(add) Add Another Terminal", action: "add" },
                { label: "$(check) Done - Save Configuration", action: "done" }
            ], {
                placeHolder: `${config.terminals.length} terminal(s) configured`
            });

            addMore = more?.action === "add";
        } else {
            // At least one terminal required
            const retry = await vscode.window.showWarningMessage(
                "At least one terminal is required.",
                "Add Terminal", "Cancel"
            );
            addMore = retry === "Add Terminal";
            if (!addMore) { return; }
        }
    }

    await saveConfig(config, workspacePath);

    const start = await vscode.window.showInformationMessage(
        `Configuration saved to ryosetup.json`,
        "Start Now", "Open File"
    );

    if (start === "Start Now") {
        await startWithConfig(config, workspacePath);
    } else if (start === "Open File") {
        const doc = await vscode.workspace.openTextDocument(path.join(workspacePath, 'ryosetup.json'));
        await vscode.window.showTextDocument(doc);
    }
}

async function addTerminalInteractively(workspacePath: string, index: number): Promise<RyoTerminalConfig | null> {
    // Terminal name
    const name = await vscode.window.showInputBox({
        prompt: `Terminal ${index}: Name`,
        placeHolder: "e.g., Frontend, Backend, Database",
        value: index === 1 ? "Frontend" : index === 2 ? "Backend" : `Terminal ${index}`
    });
    if (!name) { return null; }

    // Directory - show folder picker
    const dirOptions = await getDirOptions(workspacePath);
    const dir = await vscode.window.showQuickPick(dirOptions, {
        placeHolder: "Select or enter directory",
        title: `${name} - Working Directory`
    });
    if (!dir) { return null; }

    let directory = dir.value;
    if (dir.value === "__custom__") {
        const customDir = await vscode.window.showInputBox({
            prompt: "Enter directory path (relative to workspace)",
            placeHolder: "./my-folder"
        });
        if (!customDir) { return null; }
        directory = customDir;
    }

    // Command
    const cmdSuggestions = getCommandSuggestions(name, directory);
    const cmdOptions = [
        ...cmdSuggestions.map(cmd => ({ label: cmd, value: cmd })),
        { label: "$(edit) Custom Command...", value: "__custom__" }
    ];

    const cmd = await vscode.window.showQuickPick(cmdOptions, {
        placeHolder: "Select or enter command",
        title: `${name} - Command to run`
    });
    if (!cmd) { return null; }

    let command = cmd.value;
    if (cmd.value === "__custom__") {
        const customCmd = await vscode.window.showInputBox({
            prompt: "Enter command to run",
            placeHolder: "npm run dev"
        });
        if (!customCmd) { return null; }
        command = customCmd;
    }

    // Color
    const colorOptions = [
        { label: "$(circle-filled) Green", value: "terminal.ansiGreen" },
        { label: "$(circle-filled) Blue", value: "terminal.ansiBlue" },
        { label: "$(circle-filled) Yellow", value: "terminal.ansiYellow" },
        { label: "$(circle-filled) Red", value: "terminal.ansiRed" },
        { label: "$(circle-filled) Magenta", value: "terminal.ansiMagenta" },
        { label: "$(circle-filled) Cyan", value: "terminal.ansiCyan" },
        { label: "$(circle-outline) Default", value: undefined }
    ];

    const color = await vscode.window.showQuickPick(colorOptions, {
        placeHolder: "Select terminal color (optional)",
        title: `${name} - Color`
    });

    return {
        name,
        directory,
        command,
        color: color?.value
    };
}

async function getDirOptions(workspacePath: string): Promise<Array<{ label: string; value: string }>> {
    const options: Array<{ label: string; value: string }> = [
        { label: "$(folder) Current Directory (.)", value: "." }
    ];

    try {
        const entries = fs.readdirSync(workspacePath, { withFileTypes: true });
        const dirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== 'vendor');
        
        dirs.forEach(dir => {
            options.push({ label: `$(folder) ${dir.name}`, value: `./${dir.name}` });
        });
    } catch (error) {
        console.error('Error reading directories:', error);
    }

    options.push({ label: "$(edit) Enter Custom Path...", value: "__custom__" });
    return options;
}

function getCommandSuggestions(name: string, directory: string): string[] {
    const nameLower = name.toLowerCase();
    const suggestions: string[] = [];

    if (nameLower.includes('front') || nameLower.includes('client') || nameLower.includes('react') || nameLower.includes('vue') || nameLower.includes('next')) {
        suggestions.push('npm run dev', 'npm start', 'yarn dev', 'pnpm dev', 'npm run serve');
    } else if (nameLower.includes('back') || nameLower.includes('server') || nameLower.includes('api')) {
        suggestions.push('npm run dev', 'php artisan serve', 'python manage.py runserver', 'node server.js', 'go run main.go');
    } else if (nameLower.includes('docker')) {
        suggestions.push('docker-compose up', 'docker-compose up -d', 'docker-compose logs -f');
    } else if (nameLower.includes('db') || nameLower.includes('database') || nameLower.includes('mongo')) {
        suggestions.push('mongod', 'mysql.server start', 'pg_ctl start');
    } else if (nameLower.includes('test') || nameLower.includes('watch')) {
        suggestions.push('npm test', 'npm run test:watch', 'npm run watch', 'jest --watch');
    } else {
        suggestions.push('npm run dev', 'npm start', 'yarn dev');
    }

    return suggestions;
}

async function editConfigInteractively(config: RyoSetupConfig): Promise<RyoSetupConfig | null> {
    // For now, open the config in JSON editor
    // Future: implement interactive editing
    
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) { return null; }

    // Save temp config
    const tempPath = path.join(workspacePath, '.ryosetup.temp.json');
    fs.writeFileSync(tempPath, JSON.stringify(config, null, 2));

    const doc = await vscode.workspace.openTextDocument(tempPath);
    await vscode.window.showTextDocument(doc);

    const result = await vscode.window.showInformationMessage(
        "Edit the configuration and save, then click 'Use This Config'",
        "Use This Config", "Cancel"
    );

    if (result === "Use This Config") {
        const newContent = doc.getText();
        try {
            const newConfig = JSON.parse(newContent);
            fs.unlinkSync(tempPath);
            return newConfig;
        } catch (e) {
            vscode.window.showErrorMessage("Invalid JSON configuration");
            return null;
        }
    }

    fs.unlinkSync(tempPath);
    return null;
}

async function editRyoSetupConfig() {
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return;
    }

    const configPath = findRyoSetupFile(workspacePath);
    
    if (configPath) {
        const doc = await vscode.workspace.openTextDocument(configPath);
        await vscode.window.showTextDocument(doc);
    } else {
        const create = await vscode.window.showWarningMessage(
            "No ryosetup.json found. Create one?",
            "Create", "Cancel"
        );
        if (create === "Create") {
            await createRyoSetupConfig();
        }
    }
}

async function saveConfig(config: RyoSetupConfig, workspacePath: string) {
    // Create a clean config for saving (relative paths)
    const saveConfig = {
        name: config.name,
        description: config.description,
        version: "1.0",
        terminals: config.terminals.map(t => ({
            name: t.name,
            directory: t.directory.startsWith(workspacePath) 
                ? './' + path.relative(workspacePath, t.directory) 
                : t.directory,
            command: t.command,
            color: t.color,
            icon: t.icon,
            autoStart: t.autoStart,
            delay: t.delay
        }))
    };

    const configPath = path.join(workspacePath, 'ryosetup.json');
    const content = JSON.stringify(saveConfig, null, 2);
    
    fs.writeFileSync(configPath, content);
    currentConfig = config;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TERMINAL MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

async function startWithConfig(config: RyoSetupConfig, workspacePath: string) {
    currentConfig = config;

    for (let i = 0; i < config.terminals.length; i++) {
        const terminalConfig = config.terminals[i];
        
        // Skip if autoStart is explicitly false
        if (terminalConfig.autoStart === false) {
            continue;
        }

        // Resolve directory path
        const cwd = terminalConfig.directory.startsWith('/') 
            ? terminalConfig.directory 
            : path.resolve(workspacePath, terminalConfig.directory);

        // Verify directory exists
        if (!fs.existsSync(cwd)) {
            vscode.window.showWarningMessage(`Directory not found: ${terminalConfig.directory}. Skipping "${terminalConfig.name}".`);
            continue;
        }

        // Create terminal with options
        const terminalOptions: vscode.TerminalOptions = {
            name: `Ryo: ${terminalConfig.name}`,
            cwd: cwd,
            iconPath: terminalConfig.icon ? new vscode.ThemeIcon(terminalConfig.icon) : new vscode.ThemeIcon('terminal'),
            color: terminalConfig.color ? new vscode.ThemeColor(terminalConfig.color) : new vscode.ThemeColor(TERMINAL_COLORS[i % TERMINAL_COLORS.length])
        };

        const terminal = vscode.window.createTerminal(terminalOptions);
        activeTerminals.set(terminalConfig.name, terminal);

        // Handle delay
        if (terminalConfig.delay && terminalConfig.delay > 0) {
            setTimeout(() => {
                terminal.sendText(terminalConfig.command);
            }, terminalConfig.delay);
        } else {
            terminal.sendText(terminalConfig.command);
        }

        terminal.show(false); // Don't focus
    }

    // Focus the first terminal
    const firstTerminal = activeTerminals.values().next().value;
    if (firstTerminal) {
        firstTerminal.show(true);
    }

    isRunning = true;
    updateStatusBar();
    
    vscode.window.showInformationMessage(`🚀 ${config.name}: ${activeTerminals.size} terminal(s) started`);
}

async function stopAllTerminals() {
    for (const terminal of activeTerminals.values()) {
        terminal.dispose();
    }
    activeTerminals.clear();
    isRunning = false;
    updateStatusBar();
    vscode.window.showInformationMessage('Ryo Dev: All terminals stopped');
}

async function restartAllTerminals() {
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath || !currentConfig) {
        vscode.window.showErrorMessage("No configuration to restart.");
        return;
    }

    await stopAllTerminals();
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    await startWithConfig(currentConfig, workspacePath);
}

async function restartTerminal() {
    if (activeTerminals.size === 0) {
        vscode.window.showInformationMessage("No active terminals to restart.");
        return;
    }

    const items = Array.from(activeTerminals.entries()).map(([name, terminal]) => ({
        label: `$(refresh) ${name}`,
        description: "Click to restart",
        name: name
    }));

    const selection = await vscode.window.showQuickPick(items, {
        placeHolder: "Select terminal to restart"
    });

    if (!selection || !currentConfig) { return; }

    const terminalConfig = currentConfig.terminals.find(t => t.name === selection.name);
    if (!terminalConfig) { return; }

    const oldTerminal = activeTerminals.get(selection.name);
    if (oldTerminal) {
        oldTerminal.dispose();
        activeTerminals.delete(selection.name);
    }

    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '.';
    const cwd = terminalConfig.directory.startsWith('/') 
        ? terminalConfig.directory 
        : path.resolve(workspacePath, terminalConfig.directory);

    const newTerminal = vscode.window.createTerminal({
        name: `Ryo: ${terminalConfig.name}`,
        cwd: cwd,
        iconPath: new vscode.ThemeIcon(terminalConfig.icon || 'terminal'),
        color: terminalConfig.color ? new vscode.ThemeColor(terminalConfig.color) : undefined
    });

    newTerminal.sendText(terminalConfig.command);
    newTerminal.show();
    activeTerminals.set(terminalConfig.name, newTerminal);

    vscode.window.showInformationMessage(`Restarted: ${terminalConfig.name}`);
}

async function showActiveTerminals() {
    if (activeTerminals.size === 0) {
        vscode.window.showInformationMessage("No active terminals.");
        return;
    }

    interface TerminalMenuItem extends vscode.QuickPickItem {
        name: string;
        action: string;
    }
    
    const items: TerminalMenuItem[] = [];

    for (const [name] of activeTerminals) {
        items.push(
            { label: `$(terminal) ${name}`, description: "Click to focus", name, action: "focus" },
        );
    }

    items.push(
        { label: "", kind: vscode.QuickPickItemKind.Separator, name: "", action: "" },
        { label: "$(debug-stop) Stop All", description: "", name: "", action: "stopall" },
        { label: "$(refresh) Restart All", description: "", name: "", action: "restartall" }
    );

    const selection = await vscode.window.showQuickPick(items, {
        placeHolder: `${activeTerminals.size} active terminal(s)`,
        title: "Ryo Dev - Active Terminals"
    });

    if (!selection) { return; }

    switch (selection.action) {
        case "focus":
            const terminal = activeTerminals.get(selection.name);
            if (terminal) { terminal.show(); }
            break;
        case "stopall":
            await stopAllTerminals();
            break;
        case "restartall":
            await restartAllTerminals();
            break;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEACTIVATION
// ═══════════════════════════════════════════════════════════════════════════════

export function deactivate() {
    for (const terminal of activeTerminals.values()) {
        terminal.dispose();
    }
    activeTerminals.clear();
}