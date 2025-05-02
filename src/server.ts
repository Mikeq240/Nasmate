import { createConnection, ProposedFeatures, TextDocuments, CompletionItem, CompletionItemKind } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize(() => ({
  capabilities: {
    completionProvider: {}
  }
}));

connection.onCompletion(() => [
  { label: 'mov', kind: CompletionItemKind.Keyword },
  { label: 'eax', kind: CompletionItemKind.Variable }
]);

documents.listen(connection);
connection.listen();