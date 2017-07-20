const cp = require('child_process')
const {AutoLanguageClient, Convert} = require('atom-languageclient')

class TypeScriptLanguageClient extends AutoLanguageClient {
  getGrammarScopes () { return [ 'source.haskell' ] }
  getLanguageName () { return 'Haskell' }
  getServerName () { return 'haskell-ide-engine' }

  startServerProcess () {
    return cp.spawn('hie', ['--lsp'])
  }

  activate() {
    super.activate()
    this._disposable.add(
      atom.commands.add('atom-text-editor', 'hie-lsp-adapter:rename', ({currentTarget}) => this.rename(currentTarget.getModel()))
    )
  }

  async rename(editor) {
    const position = Convert.pointToPosition(editor.getLastCursor().getBufferPosition())
    const server = await this._serverManager.getServer(editor);
    if (server == null || !server.capabilities.renameProvider) { return null; }
    const newName = await new Promise((resolve,reject) => {
      const input = document.createElement('atom-text-editor')
      input.setAttribute('mini', true)
      const panel = atom.workspace.addModalPanel({
        item: input
      })
      input.focus()
      atom.commands.add(input, 'core:confirm', () => {
        panel.destroy()
        resolve(input.getModel().getText())
      })
      atom.commands.add(input, 'core:cancel', () => {
        panel.destroy()
        reject()
      })
    })
    const result = await server.connection.rename({
      textDocument: Convert.editorToTextDocumentIdentifier(editor),
      position,
      newName
    })
    const changes = result.changes
    for (const file in changes) {
      const ed = await atom.workspace.open(Convert.uriToPath(file), {activatePane: false, activateItem: false, searchAllPanes: true})
      ed.transact(() => {
        for (const {newText, range} of changes[file]) {
          ed.setTextInBufferRange(Convert.lsRangeToAtomRange(range), newText);
        }
      })
    }
    atom.views.getView(editor).focus()
  }
}

module.exports = new TypeScriptLanguageClient()
