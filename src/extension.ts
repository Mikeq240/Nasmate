import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // Read the instructions from the JSON file
  const instructionsFilePath = path.join(context.extensionPath, 'data', 'instructions.json');
  const instructionsData = JSON.parse(fs.readFileSync(instructionsFilePath, 'utf-8'));

  // Hover provider
  const hoverProvider = vscode.languages.registerHoverProvider('asm', {
    provideHover(document: vscode.TextDocument, position: vscode.Position) {
      const wordRange = document.getWordRangeAtPosition(position);
      const word = document.getText(wordRange);

      const description = instructionsData[word];

      if (description) {
        return new vscode.Hover(description);
      }
    }
  });

  // Completion provider
  const completionProvider = vscode.languages.registerCompletionItemProvider('asm', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
      const completionItems: vscode.CompletionItem[] = [];

      for (let instruction in instructionsData) {
        const completionItem = new vscode.CompletionItem(instruction, vscode.CompletionItemKind.Keyword);
        completionItem.documentation = new vscode.MarkdownString(instructionsData[instruction]);
        completionItems.push(completionItem);
      }

      return completionItems;
    }
  });

  // Register providers
  context.subscriptions.push(hoverProvider);
  context.subscriptions.push(completionProvider);
}
