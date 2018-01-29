'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, TextEditor, Range, Position } from 'vscode';
import * as sqlFormatter  from 'sql-formatter';

var sqlChannel = vscode.window.createOutputChannel('sqlFormatter');
var editor     = vscode.window.activeTextEditor;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "sql Formatter" is now active!');

    let sqlFormatter  = new sqlFormatterClass();

    vscode.languages.registerDocumentFormattingEditProvider('sql', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            let data = sqlFormatter.formatter();
            return [vscode.TextEdit.replace(new Range(data.start, data.end), data.text)];
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}

export class sqlFormatterClass {
    constructor() {}

    formatter() {
        let editor = vscode.window.activeTextEditor;
        let text   = editor.document.getText();

        sqlChannel.append("---------------------------\n");
        sqlChannel.append("Iniciando formatação do SQL\n");
        sqlChannel.append("-------------**------------\n");

        if(text.trim()!='') {
            let textFormatted = sqlFormatter.format(text, {
                language: "sql", // Defaults to "sql"
                indent: "    "   // Defaults to two spaces
            });

            const document = editor.document;
            const lastLine = document.lineAt(document.lineCount-1);

            const start    = new Position(0, 0);
            const end      = new Position(document.lineCount-1, lastLine.text.length);

            sqlChannel.append("Formatação concluída!\n");
            sqlChannel.append("---------------------------\n\n");

            return {"start": start, "end": end, "text": textFormatted};
        } else {
            sqlChannel.append("Não foi possível localizar o texto para formatação\n");
            sqlChannel.append("---------------------------\n\n");

            vscode.window.showErrorMessage('Não foi possível localizar o texto para formatação!');
        }
    }
}
