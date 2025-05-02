const vscode = require('vscode');
const fs = require('fs').promises;
const path = require('path');

let instructions = {};
let registers = {};

/**
 * Activates the extension.
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    try {
        // Load instructions and registers data from JSON files
        const instructionsPath = path.join(__dirname, 'data', 'instructions.json');
        const registersPath = path.join(__dirname, 'data', 'registers.json');

        const instructionsData = await fs.readFile(instructionsPath, 'utf8');
        const registersData = await fs.readFile(registersPath, 'utf8');

        instructions = JSON.parse(instructionsData);
        registers = JSON.parse(registersData);

        // Register Hover Provider for NASM
        context.subscriptions.push(
            vscode.languages.registerHoverProvider('nasm', {
                provideHover(document, position, token) {
                    const word = getWordAtPosition(document, position);
                    if (instructions[word]) {
                        return new vscode.Hover(instructions[word]);
                    } else if (registers[word]) {
                        return new vscode.Hover(registers[word]);
                    }
                    return null;
                }
            })
        );

        // Register Completion Provider for NASM
        context.subscriptions.push(
            vscode.languages.registerCompletionItemProvider('nasm', {
                provideCompletionItems(document, position, token, context) {
                    const completionItems = [];

                    // Add instructions to completion items
                    for (const instr in instructions) {
                        const item = new vscode.CompletionItem(instr, vscode.CompletionItemKind.Keyword);
                        item.documentation = new vscode.MarkdownString(instructions[instr]);
                        completionItems.push(item);
                    }

                    // Add registers to completion items
                    for (const reg in registers) {
                        const item = new vscode.CompletionItem(reg, vscode.CompletionItemKind.Variable);
                        item.documentation = new vscode.MarkdownString(registers[reg]);
                        completionItems.push(item);
                    }

                    return completionItems;
                }
            })
        );

        console.log('NASM extension activated successfully');
    } catch (err) {
        console.error('Error loading data files:', err);
    }
}

/**
 * Deactivates the extension.
 */
function deactivate() {
    // Cleanup logic if needed
}

/**
 * Helper function to get the word at the current cursor position.
 * @param {vscode.TextDocument} document
 * @param {vscode.Position} position
 * @returns {string | null}
 */
function getWordAtPosition(document, position) {
    const range = document.getWordRangeAtPosition(position);
    if (range) {
        return document.getText(range);
    }
    return null;
}

module.exports = {
    activate,
    deactivate
};