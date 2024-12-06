import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let terminal1: vscode.Terminal | undefined;
let terminal2: vscode.Terminal | undefined;
let isRunning = false;

export function activate(context: vscode.ExtensionContext) {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(play) Start Ryo Dev";
    statusBarItem.command = "extension.toggleRyoDevServe";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    let disposableToggle = vscode.commands.registerCommand('extension.toggleRyoDevServe', () => {
        if (isRunning) {
            stopRyoDevServe();
            statusBarItem.text = "$(play) Start Ryo Dev";
        } else {
            vscode.window.showQuickPick(['Ryo: Dev Serve', 'Ryo: Javascript Laravel'], {
                placeHolder: 'Select the mode to run'
            }).then((selection) => {
                if (selection === 'Ryo: Dev Serve') {
                    startRyoDevServe();
                } else if (selection === 'Ryo: Javascript Laravel') {
                    startRyoJsLaravel();
                }
                if (selection) {
                    statusBarItem.text = "$(stop) Stop Ryo Dev";
                    isRunning = true;
                }
            });
        }
    });

    context.subscriptions.push(disposableToggle);
}

function startRyoDevServe() {
    if (!terminal1) {
        terminal1 = vscode.window.createTerminal(`Ryo: Dev`);
        terminal1.sendText('npm run dev');
        terminal1.show();
    }

    if (!terminal2) {
        terminal2 = vscode.window.createTerminal(`Ryo: Serve`);
        terminal2.sendText('php artisan serve');
        terminal2.show();
    }

    vscode.window.showInformationMessage('Ryo: Dev Serve started');
}

function startRyoJsLaravel() {
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) {
        vscode.window.showErrorMessage("Workspace path not found.");
        return;
    }

    const ryosetupPath = findRyoSetupFile(workspacePath);
    if (!ryosetupPath) {
        vscode.window.showErrorMessage('File "ryosetup" not found in the workspace root.');
        return;
    }

    const { frontendDir, backendDir, frontendCmd, backendCmd } = parseRyoSetupFile(ryosetupPath, workspacePath);

    if (!frontendDir || !fs.existsSync(frontendDir)) {
        vscode.window.showErrorMessage(`Frontend directory not found at: ${frontendDir}`);
        return;
    }

    if (!backendDir || !fs.existsSync(backendDir)) {
        vscode.window.showErrorMessage(`Backend directory not found at: ${backendDir}`);
        return;
    }

    if (!terminal1) {
        terminal1 = vscode.window.createTerminal({
            name: 'Ryo: Front-End',
            cwd: frontendDir
        });
        terminal1.sendText(frontendCmd);
        terminal1.show();
    }

    if (!terminal2) {
        terminal2 = vscode.window.createTerminal({
            name: 'Ryo: Back-End',
            cwd: backendDir
        });
        terminal2.sendText(backendCmd);
        terminal2.show();
    }

    vscode.window.showInformationMessage('Ryo: Javascript Laravel started successfully');
}


function stopRyoDevServe() {
    if (terminal1) {
        terminal1.dispose();
        terminal1 = undefined;
    }

    if (terminal2) {
        terminal2.dispose();
        terminal2 = undefined;
    }

    isRunning = false;
    vscode.window.showInformationMessage('Ryo: Dev Serve stopped');
}

function findRyoSetupFile(directory: string): string | undefined {
    try {
        const files = fs.readdirSync(directory);
        const ryosetupFile = files.find(file => file.toLowerCase().startsWith('ryosetup'));
        return ryosetupFile ? path.join(directory, ryosetupFile) : undefined;
    } catch (error) {
        console.error('Error finding ryosetup file:', error);
        return undefined;
    }
}

function parseRyoSetupFile(filePath: string, workspacePath: string): { frontendDir: string, backendDir: string, frontendCmd: string, backendCmd: string } {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);

    if (lines.length < 4) {
        throw new Error('ryosetup file must contain frontend path, backend path, frontend command, and backend command');
    }

    const frontendDir = path.resolve(workspacePath, lines[0]);
    const backendDir = path.resolve(workspacePath, lines[1]);
    const frontendCmd = lines[2];
    const backendCmd = lines[3];

    return { frontendDir, backendDir, frontendCmd, backendCmd };
}


export function deactivate() {
    stopRyoDevServe();
}