# hie-lsp-adapter package

Quick-and-dirty haskell-ide-engine support package for Atom based on atom-languageclient.

*** This package is in early alpha ***

## Installation

```
apm install atom-haskell/hie-lsp-adapter atom-ide-ui language-haskell
```

You will also need to have [haskell-ide-engine](https://github.com/haskell/haskell-ide-engine) executable in PATH, which should be built with the same GHC version your project uses. For stack users, `stack install haskell-ide-engine` in project root should work. Bear in mind it's installed globally, so that might break other projects using different resolvers.

## License
MIT License.  See [the license](LICENSE.md) for more details.
