// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { Func } from 'mocha';
import * as vscode from 'vscode';

var cutToEnd = false;
var cutLine = -1;
var cutTextEditor: vscode.TextEditor | null = null;

async function cut(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
	if (!textEditor.selection.isEmpty){
		// if we selected something, just cut that
		let text = textEditor.document.getText(textEditor.selection);
		vscode.env.clipboard.writeText(text);
		edit.delete(textEditor.selection);
		return;
	}
	if (cutToEnd) {
		// cut until end of line (replace clipboard contents)
		let line = textEditor.document.lineAt(textEditor.selection.active.line);
		let range = new vscode.Range(textEditor.selection.active, line.range.end);
		let text = textEditor.document.getText(range);
		vscode.env.clipboard.writeText(text);
		edit.delete(range);
		return;
	}
	// we should cut the entire line, and either add it to our current clipboard or start fresh
	// in order to add to our current clipboard, we must:
	// 1. have started a cut operation recently
	// 2. we're still using the same editor
	// 2. between then and now, we should not have modified the document
	// 3. we should cut the same line as last time 
	// (if we're cutting a different line, it's a new cut operation)
	// the original "next" line would have the same line number as the line that was cut
	// if cutLine = -1, there is no recent cut operation after the latest modification (will be reset to -1 on edit)
	// else it should match our current line anyway
	let range = new vscode.Range(textEditor.selection.active.line, 0, textEditor.selection.active.line + 1, 0);
    let text = textEditor.document.getText(range);
	vscode.window.showInformationMessage(cutLine.toString() + (cutTextEditor === textEditor ? "true" : "false"));
	if (cutLine === textEditor.selection.active.line && cutTextEditor === textEditor) {
		await vscode.env.clipboard.readText().then((str) => {
			text = str + text;
		});
	}
	vscode.env.clipboard.writeText(text);
	// set cutLine after the delete so our edit won't reset it to -1
	textEditor.edit((editBuilder) =>{
		editBuilder.delete(range);
	}).then(()=>{
		cutLine = textEditor.selection.active.line;
	});
	cutTextEditor = textEditor;
	return;
}

function toggleCutToEnd(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
	cutToEnd = !cutToEnd;
	vscode.window.setStatusBarMessage("Cut to end " + (cutToEnd ? "enabled" : "disabled"), 3000);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var commands: { [name: string]: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => void } = {
		'cut': cut,
		'toggleCutToEnd': toggleCutToEnd,
	};
	for (let key in commands) {
		context.subscriptions.push(vscode.commands.registerTextEditorCommand('nano-keybindings.'+key, commands[key]));
	}
	vscode.workspace.onDidChangeTextDocument(() => {cutLine = -1; vscode.window.showInformationMessage("Reset");});
}

// this method is called when your extension is deactivated
export function deactivate() {}
