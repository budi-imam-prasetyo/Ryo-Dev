import * as vscode from 'vscode';

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
            startRyoDevServe();
            statusBarItem.text = "$(stop) Stop Ryo Dev";
        }
        isRunning = !isRunning;
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
        terminal2.sendText('npm run serve');
        terminal2.show();
    }

    vscode.window.showInformationMessage('Ryo: Dev Serve started');
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

    vscode.window.showInformationMessage('Ryo: Dev Serve stopped');
}

export function deactivate() {
    if (terminal1) {
        terminal1.dispose();
    }

    if (terminal2) {
        terminal2.dispose();
    }
}
