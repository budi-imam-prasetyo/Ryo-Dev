import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let terminalDev: vscode.Terminal | undefined;
let terminalServe: vscode.Terminal | undefined;

export function activate(context: vscode.ExtensionContext) {

    // Register the command to start dev and serve
    let startDisposable = vscode.commands.registerCommand('extension.ryoDevServe', () => {
        if (!terminalDev) {
            terminalDev = vscode.window.createTerminal({ name: "Dev Terminal" });
        }
        terminalDev.sendText("npm run dev");

        if (!terminalServe) {
            terminalServe = vscode.window.createTerminal({ name: "Serve Terminal" });
        }
        terminalServe.sendText("npm run serve");

        terminalDev.show();
        terminalServe.show();
    });

    // Register the command to stop dev and serve
    let stopDisposable = vscode.commands.registerCommand('extension.stopRyoDevServe', () => {
        if (terminalDev) {
            terminalDev.sendText('\x03'); // Send Ctrl+C
        }
        if (terminalServe) {
            terminalServe.sendText('\x03'); // Send Ctrl+C
        }
    });

    // Add the command to update package.json on activation
    context.subscriptions.push(startDisposable);
    context.subscriptions.push(stopDisposable);

    // Update package.json with serve script
    updatePackageJsonWithServeScript();
}

export function deactivate() {
    if (terminalDev) {
        terminalDev.dispose();
    }
    if (terminalServe) {
        terminalServe.dispose();
    }
}

function updatePackageJsonWithServeScript() {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (workspaceFolders) {
        const packageJsonPath = path.join(workspaceFolders[0].uri.fsPath, 'package.json');

        fs.readFile(packageJsonPath, 'utf8', (err, data) => {
            if (err) {
                vscode.window.showErrorMessage('Error reading package.json');
                return;
            }

            try {
                const packageJson = JSON.parse(data);
                if (!packageJson.scripts) {
                    packageJson.scripts = {};
                }

                if (!packageJson.scripts.serve) {
                    packageJson.scripts.serve = "php artisan serve";

                    fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
                        if (err) {
                            vscode.window.showErrorMessage('Error writing to package.json');
                            return;
                        }

                        vscode.window.showInformationMessage('Added "serve": "php artisan serve" to package.json');
                    });
                }
            } catch (parseError) {
                vscode.window.showErrorMessage('Error parsing package.json');
            }
        });
    }
}
