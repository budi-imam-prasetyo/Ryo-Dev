import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.devServe', () => {
        // Create and show a new terminal
        const terminal1 = vscode.window.createTerminal('Dev Server');
        terminal1.sendText('npm run dev');

        // Create and show another new terminal
        const terminal2 = vscode.window.createTerminal('Serve Server');
        terminal2.sendText('npm run serve');

        // Show terminals
        terminal1.show();
        terminal2.show();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
