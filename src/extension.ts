// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('copy-paste-git-branch.copyBranchName', () => {
		vscode.env.clipboard.writeText(getBranchName());
	});

	context.subscriptions.push(disposable);

	let disposable2 = vscode.commands.registerCommand('copy-paste-git-branch.pasteBranchName', () => {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		const branchName = getBranchName();
		if (editor) {
			const document = editor.document;
			editor.edit(editBuilder => {
				editor.selections.forEach(sel => {
					const range = sel.isEmpty ? document.getWordRangeAtPosition(sel.start) || sel : sel;
					editBuilder.replace(range, branchName);
				});
			});
		}
	});
	context.subscriptions.push(disposable2);
}

function getBranchName() {
	try {
		const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
		const api = gitExtension.getAPI(1);
		const repo = api.repositories[0];
		const head = repo.state.HEAD;
		// Get the branch and commit 
		const { commit, name: branch } = head;
		return branch;
	} catch (error) {
		console.error(`error:`, error);
		return 'could not find branch name';
	}

}

// this method is called when your extension is deactivated
export function deactivate() { }
