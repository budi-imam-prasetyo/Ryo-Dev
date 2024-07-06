import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.ryoDevServe', () => {
        const terminalDev = vscode.window.createTerminal({ name: "Dev Terminal" });
        terminalDev.sendText("npm run dev");

        const terminalServe = vscode.window.createTerminal({ name: "Serve Terminal" });
        terminalServe.sendText("npm run serve");

        terminalDev.show();
        terminalServe.show();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
