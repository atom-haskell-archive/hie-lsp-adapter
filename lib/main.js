const cp = require('child_process')
const {AutoLanguageClient, Convert} = require('atom-languageclient')

class TypeScriptLanguageClient extends AutoLanguageClient {
  getGrammarScopes () { return [ 'source.haskell' ] }
  getLanguageName () { return 'Haskell' }
  getServerName () { return 'haskell-ide-engine' }

  startServerProcess () {
    return cp.spawn('hie', ['--lsp'])
  }
}

module.exports = new TypeScriptLanguageClient()
