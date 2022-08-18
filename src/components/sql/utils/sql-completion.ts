import * as monaco from 'monaco-editor'
const hints = [
  'SELECT',
  'INSERT',
  'DELETE',
  'UPDATE',
  'CREATE TABLE',
  'DROP TABLE',
  'ALTER TABLE',
  'CREATE VIEW',
  'DROP VIEW',
  'CREATE INDEX',
  'DROP INDEX',
  'CREATE PROCEDURE',
  'DROP PROCEDURE',
  'CREATE TRIGGER',
  'DROP TRIGGER',
  'CREATE SCHEMA',
  'DROP SCHEMA',
  'CREATE DOMAIN',
  'ALTER DOMAIN',
  'DROP DOMAIN',
  'GRANT',
  'DENY',
  'REVOKE',
  'COMMIT',
  'ROLLBACK',
  'SET TRANSACTION',
  'DECLARE',
  'EXPLAN',
  'OPEN',
  'FETCH',
  'CLOSE',
  'PREPARE',
  'EXECUTE',
  'DESCRIBE',
  'FORM',
  'ORDER BY'
]
function createCompleter(getExtraHints: any, databaseHints: string[] = [], table: any[] = []) {
  // [...hints, ...databaseHints]
  const hasDatabaseHints = [...hints, ...table.map(item => item.database)]
  const createSuggestions = function (model: any, textUntilPosition: any) {
    const text = model.getValue()
    const textUntilPositionFirstReplace = textUntilPosition.replace(/[\*\[\]@\$\(\)]/g, '')
    const textUntilPositionSecond = textUntilPositionFirstReplace.replace(/(\s+|\.)/g, ' ')
    const arr = textUntilPositionSecond.split(/[\s;]/)
    const activeStr = arr[arr.length - 1]
    
    if (text.includes('.')) {
      // const database = table.map(item => item.database)
      const noEmptyArr = arr.filter((item: string) => !!item)
      const noEmptyActiveStr = noEmptyArr[noEmptyArr.length - 1]
      if (text.endsWith('.')) {
        
        const tables = table.filter(item => item.database === noEmptyActiveStr)
        if (tables.length) {
          return tables.map(item => {
            return {
              label: item.name,
              kind: monaco.languages.CompletionItemKind.Constant,
              documentation: item.name,
              insertText: item.name
            }
          })
        } else {
          return []
        }
      } else {
        const newtextUntilPosition = textUntilPositionFirstReplace.replace(/(\s+)/g, ' ')
        const newArr = newtextUntilPosition.split(/[\s;]/)
        const last = newArr[newArr.length - 1]
        if (last.includes('.')) {
          const [database, tableStr] = last.split('.')
          const tables = table.filter((item: any) => item.database === database)
            .filter((item: any) => item.name.includes(tableStr))
          return tables.map((item: any) => {
            return {
              label: item.name,
              kind: monaco.languages.CompletionItemKind.Constant,
              documentation: item.name,
              insertText: item.name
            }
          })
        }
      }
    } else {
      // const textUntilPositionSecond = textUntilPositionFirstReplace.replace(/(\s+|\.)/g, ' ')
      // const arr = textUntilPositionSecond.split(/[\s;]/)
      // const activeStr = arr[arr.length - 1]
      const len = activeStr.length
      const rexp = new RegExp('([^\\w]|^)' + activeStr + '\\w*', 'gim')
      const match = text.match(rexp)
      const textHints = !match ? [] :
        match.map((ele: any) => {
          const rexp = new RegExp(activeStr, 'gim')
          const search = ele.search(rexp)
          return ele.substr(search)
        })
      const mergeHints = Array.from(new Set([...hasDatabaseHints, ...textHints, ...getExtraHints(model)]))
        .sort()
        .filter(ele => {
          const rexp = new RegExp(ele.substr(0, len), 'gim')
          return (match && match.length === 1 && ele === activeStr) ||
            ele.length === 1 ? false : activeStr.match(rexp)
        })
      return mergeHints.map(ele => ({
        label: ele,
        kind: hasDatabaseHints.indexOf(ele) > -1 ?
          monaco.languages.CompletionItemKind.Keyword :
          monaco.languages.CompletionItemKind.Text,
        documentation: ele,
        insertText: ele
      }))
    }
  }
  return {
    triggerCharacters: ['.'],
    provideCompletionItems(model: any, position: any) {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      })
      return {
        suggestions: createSuggestions(model, textUntilPosition)
      }
    }
  }
}
export default createCompleter