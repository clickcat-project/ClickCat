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

function getSuggestionItem (item: any) {
  return {
    label: item.name,
    kind: monaco.languages.CompletionItemKind.Constant,
    documentation: item.name,
    insertText: item.name
  }
}

function createCompleter(getExtraHints: any, tables: any[] = [], columns: any[]) {
  // [...hints, ...databaseHints]
  const hasDatabaseHints = [...hints, ...tables.map(item => item.database)]
  const createSuggestions = function (model: any, textUntilPosition: any) {

    const textCurrent = model.getValue()
    const textNoSpecial = textUntilPosition.replace(/[\*\[\]@\$\(\)]/g, '')

    const textHasSpot = textNoSpecial.replace(/(\s+)/g, ' ')
    const HasSpotTextArr = textHasSpot.split(/[\s;]/)
    const hasSpotActiveStr = HasSpotTextArr[HasSpotTextArr.length - 1]

    if (hasSpotActiveStr.includes('.')) {
      const activeStrArr = hasSpotActiveStr.split('.')
      const last = activeStrArr[activeStrArr.length - 1]
      if (!last) {
        if (activeStrArr.length === 2) {
          const database = activeStrArr[0]
          const tableByDatabase = tables.filter(item => item.database === database)
          return tableByDatabase.map(item => {
            return getSuggestionItem(item)
          })
        } else if (activeStrArr.length === 3) {
          // const tableName = activeStrArr[1]
          // const columnsByTable = columns.filter(item => item.table === tableName)
          // return columnsByTable.map(item => {
          //   return getSuggestionItem(item)
          // })
          return []
        }
      } else if (last) {
        if (activeStrArr.length === 2) {
          const database = activeStrArr[0]
          const tableByDatabase = tables.filter(item => item.database === database && item.name.includes(last))
          return tableByDatabase.map(item => {
            return getSuggestionItem(item)
          })
        } else if (activeStrArr.length === 3) {
          // const tableName = activeStrArr[1]
          // const columnsByTable = columns.filter(item => item.table === tableName && item.name.includes(last))
          // return columnsByTable.map(item => {
          //   return getSuggestionItem(item)
          // })
          return []
        }
      } else {
        return []
      }
    } else {
      const testNoSpot = textNoSpecial.replace(/(\s+|\.)/g, ' ')
      const noSpotTextArr = testNoSpot.split(/[\s;]/)
      const noSpotActiveStr = noSpotTextArr[noSpotTextArr.length - 1]
      const len = noSpotActiveStr.length
      const rexp = new RegExp('([^\\w]|^)' + noSpotActiveStr + '\\w*', 'gim')
      const match = textCurrent.match(rexp)
      const textHints = !match ? [] :
        match.map((ele: any) => {
          const rexp = new RegExp(noSpotActiveStr, 'gim')
          const search = ele.search(rexp)
          return ele.substr(search)
        })
      const mergeHints = Array.from(new Set([...hasDatabaseHints, ...textHints, ...getExtraHints(model)]))
        .sort()
        .filter(ele => {
          const rexp = new RegExp(ele.substr(0, len), 'gim')
          return (match && match.length === 1 && ele === noSpotActiveStr) ||
            ele.length === 1 ? false : noSpotActiveStr.match(rexp)
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