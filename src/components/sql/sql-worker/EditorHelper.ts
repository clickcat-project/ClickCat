import * as monaco from 'monaco-editor';
import monacoEditor, { IRange, Position, Selection } from 'monaco-editor';
import { Query, ServerStructure } from 'services';
import { LanguageWorker } from './LanguageWorker';
import { SupportLanguage } from './supportLanguage';
import { CommonSQL } from './grammar';
import { v4 as UUIDv4 } from 'uuid';
import { TextInsertType } from '../../types';

type tMonaco = typeof monaco;
type ExecCallback = (isAllQuery: boolean, rows: string) => void;
type IReadOnlyModel = monaco.editor.IReadOnlyModel;
type iCodeEditor = monaco.editor.ICodeEditor;

interface tbxIDisposable {
  d: monaco.IDisposable;
  id: string;
}

export interface oneToken {
  line: number;
  offset: number;
  type: string;
  language: string;
  text: string;
  range: monaco.Range;
  inCursor: boolean;
  inSelected: boolean;
}

export class EditorHelper {
  private id: string;
  private serverStructure?: ServerStructure.Server;
  private isRegistred = false;
  private monaco?: tMonaco;
  private language: SupportLanguage | null = null;
  private ready = false;

  constructor() {
    this.id = this.makeQueryId();
    // console.info('EditorHelper->create');
  }
  public getLanguage(): SupportLanguage | null {
    return this.language;
  }
  private languageParser(): CommonSQL {
    if (!this.language) {
      throw 'Error can`t CommonSQL() not set language';
    }
    return LanguageWorker.getParser(this.language);
  }

  public static addDisposable(d: monaco.IDisposable, helperId: string) {
    // hack for HotReload monacoEditor  когда hotReload или обновление структуры нужно удалить через dispose() созданные элементы
    if (!window.monacoGlobalProvider || !window.monacoGlobalProvider.IDisposable) {
      // ./app/types/app/index.d.ts
      window.monacoGlobalProvider = {
        IDisposable: [] as Array<tbxIDisposable>,
      };
    }
    window.monacoGlobalProvider.IDisposable.push({ d: d, id: helperId });
    // console.info( `EditorHelper->addDisposable(${helperId})`, window.monacoGlobalProvider.IDisposable.length );
  }

  public static disposeAll() {
    // see addDisposable(x)
    // hack for HotReload monacoEditor
    if (window.monacoGlobalProvider && window.monacoGlobalProvider.IDisposable.length) {
      // console.info(`EditorHelper->disposeAll()`);
      // clean
      for (let i: number = window.monacoGlobalProvider.IDisposable.length - 1; i >= 0; i -= 1) {
        const d = window.monacoGlobalProvider.IDisposable[i];
        d.d.dispose();
        window.monacoGlobalProvider.IDisposable.splice(i, 1);
      }
    }
  }

  public static haveDispose(): boolean {
    if (!window.monacoGlobalProvider) return false;
    if (!window.monacoGlobalProvider.IDisposable) return false;
    return window.monacoGlobalProvider.IDisposable.length;
  }

  public applyLanguage(language: SupportLanguage): void {
    if (this.language && this.language !== language) {
      this.onLanguageChange();
    }
    this.language = language;
    // console.info('EditorHelper->applyLanguage');
  }

  public onLanguageChange(): void {
    // ------------------------
    console.warn('!!! EditorHelper -> onLanguageChange');
    // ------------------------
  }

  public applyServerStructure(serverStructure: ServerStructure.Server, thisMonaco: tMonaco): void {
    // console.info('EditorHelper->applyServerStructure() ');
    this.serverStructure = serverStructure;
    LanguageWorker.setServerStructure(serverStructure);
  }

  public bindKeyExecCommand(
    editor: monaco.editor.IStandaloneCodeEditor,
    onExecCommand: ExecCallback
  ): void {
    const KM = monaco.KeyMod;
    const KC = monaco.KeyCode;
    // ======== Shift-Command-Enter ========
    editor.addAction({
      id: 'ExecAllCommand',
      label: 'Exec all query',
      keybindings: [KM.Shift | KM.CtrlCmd | KC.Enter], // eslint-disable-line no-bitwise
      precondition: undefined,
      keybindingContext: undefined,
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run(editor) {
        onExecCommand(true, '200');
      },
    });
    // ======== Command-Enter ========
    editor.addAction({
      id: 'ExecCurrentCode',
      label: 'Exec current query`s',
      keybindings: [KM.CtrlCmd | KC.Enter], // eslint-disable-line no-bitwise
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run(editor) {
        onExecCommand(false, '200');
      },
    });
  }
  public bindBaseKeys(editor: monaco.editor.IStandaloneCodeEditor): void {
    // Keys
    const KM = monaco.KeyMod;
    const KC = monaco.KeyCode;
    // KeyMod.CtrlCmd | KeyCode.Tab for ctrl+tab on Win/Linux and cmd+tab on OSX,
    // KM.CtrlCmd | KC.KeyY -> macos: cmd+Y not work in chrome

    const actions = {
      'editor.action.deleteLines': {
        // Cmd-Y -> Drop line
        label: 'Delete line',
        keybindings: [KM.chord(KM.CtrlCmd | KC.KeyY, 0)],
      },
      'editor.foldAll': {
        // Command+Shift+-
        label: 'Fold All',
        keybindings: [KM.chord(KM.Shift | KM.CtrlCmd | KC.Minus, 0)],
      },
      'editor.unfoldAll': {
        // Command+Shift+=
        label: 'Unfold All',
        keybindings: [KM.chord(KM.Shift | KM.CtrlCmd | KC.Equal, 0)],
      },
      'editor.action.formatDocument': {
        label: 'Format Document',
        keybindings: [KM.chord(KM.Shift | KM.CtrlCmd | KC.KeyF, 0)],
      }, // Shift-CtrlCmd-F
    };
    for (const [cmd, key] of Object.entries(actions)) {
      editor.addAction({
        id: `key-${cmd}`,
        label: key.label,
        keybindings: key.keybindings,
        contextMenuGroupId: '1_modification',
        contextMenuOrder: 1.5,
        run(editor) {
          editor.getAction(cmd).run();
        },
      });
    }
  }

  public register(thisMonaco: tMonaco): void {
    // console.info('EditorHelper->Try Register()');
    if (!this.language) {
      console.error('Not set language', this.language);
      return;
    }
    if (this.isRegistred) {
      console.info('EditorHelper->Register() - skip, already done');
      return;
    }
    if (!this.serverStructure) {
      console.info('EditorHelper->Register() - skip, not set serverStructure');
      return;
    }
    // console.info('EditorHelper->Register()');
    // Link
    this.monaco = thisMonaco;
    // Register
    this.isRegistred = true;
    try {
      // language not register in global,create
      if (EditorHelper.haveDispose()) EditorHelper.disposeAll();
      this.registerLanguage(this.language, this.monaco);
      this.registerCompletion(this.language, this.monaco);
    } catch (e) {
      console.error('register error', e);
    }
    this.ready = true;
  }

  public isReady(): boolean {
    if (!this.language) {
      console.info('EditorHelper->WORKER not ready - language = false');
      return false;
    }
    if (!this.ready) {
      console.info('EditorHelper->WORKER not ready - ready = false');
      return false;
    }
    if (!this.monaco) {
      console.info('EditorHelper->WORKER not ready - monaco = false');
      return false;
    }
    return this.ready;
  }

  /**
   * LanguageWorker.Hover
   *
   * @param model
   * @param position
   * @param token
   */
  public getHover(
    model: IReadOnlyModel,
    position: monaco.Position,
    token: monaco.CancellationToken
  ): monaco.languages.ProviderResult<monaco.languages.Hover> {
    // GetHover
    return LanguageWorker.getHover(model, position, token);
  }

  /**
   * LanguageWorker.Suggestions
   *
   * @param model
   * @param position
   * @param context
   * @param token
   */
  public getSuggestions(
    model: IReadOnlyModel,
    position: monaco.Position,
    context: monaco.languages.CompletionContext,
    token: monaco.CancellationToken
  ): monaco.languages.ProviderResult<monaco.languages.CompletionList> {
    return LanguageWorker.getSuggestions(model, position, context, token);
  }

  /**
   * Add&register Completion
   * @param language
   * @param thisMonaco
   */
  private registerCompletion(language: SupportLanguage, thisMonaco: tMonaco): void {
    // todo : drop use self
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    EditorHelper.addDisposable(
      thisMonaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: self.getSuggestions,
      }),
      this.id
    );
    // thisMonaco.languages.reg();
    EditorHelper.addDisposable(
      thisMonaco.languages.registerHoverProvider(language, {
        provideHover: self.getHover,
      }),
      this.id
    );
  }

  public async OnChange(modelUri: string, content: string) {
    if (this.language && modelUri) {
      LanguageWorker.parseAndApplyModel(this.language, modelUri, content);
    }
  }

  /**
   * Set the editing configuration for the language
   *
   * @param language
   */
  private getIMonarchLanguage(): monaco.languages.IMonarchLanguage {
    //   lexer?.ruleNames -> ['INDEX', 'INF', 'INJECTIVE', 'INNER', 'INSERT', 'INTERVAL', 'INTO', 'IS', ]
    //   lexer?.literalNames -> [null,....,"'+'","'?'"]
    //   lexer?.symbolicNames -> ['ADD', 'AFTER', 'ALIAS', 'ALL', 'ALTER', 'AND', 'ANTI', 'ANY']
    // languageWords
    // languageSettings.builtinFunctions = [];
    // .typeKeywords
    // .keywordsGlobal
    // .keywords
    // .
    // Test method`s
    // ---
    let lang: monaco.languages.IMonarchLanguage;
    // Merge with server structure,  and support many lang`s
    lang = this.languageParser().getIMonarchLanguage() as monaco.languages.IMonarchLanguage;
    lang = LanguageWorker.getMonarchLanguage(lang);
    return lang;
  }

  /**
   * Register a new language and addDisposable list
   * @param language
   * @param thisMonaco
   * @private
   */
  private registerLanguage(language: SupportLanguage, thisMonaco: tMonaco): void {
    if (!thisMonaco.languages.getLanguages().some(({ id }) => id === this.language)) {
      thisMonaco.languages.register({ id: language, extensions: ['.sql'], aliases: ['chsql'] });
    }

    /**
     * Set the editing configuration for the language
     */
    EditorHelper.addDisposable(
      thisMonaco.languages.setMonarchTokensProvider(language, this.getIMonarchLanguage()),
      this.id
    );
    /**
     * Register a tokens provider for the language
     */
    EditorHelper.addDisposable(
      thisMonaco.languages.setLanguageConfiguration(
        language,
        this.languageParser().getLanguageConfiguration()
      ),
      this.id
    );
  }
  public insert(editor: iCodeEditor, textToInsert: string, mode: TextInsertType) {
    const line = editor.getPosition();
    // const line = this.monaco?.editor.getModel().get
    console.log('INSERTT', line);

    // const line = this.editor.getPosition();

    if (line && this.monaco) {
      const range = new this.monaco.Range(
        line.lineNumber,
        line.column + 1,
        line.lineNumber,
        line.column + 1
      );
      const id = { major: 1, minor: 1 };
      const op = { identifier: id, range, text: textToInsert, forceMoveMarkers: true };
      editor.executeEdits('my-source', [op]);
      editor.focus();
    }
  }

  private getVariables(q: string): any {
    return [];
  }

  private getSymbolicName(): any {
    //
    return [];
  }

  public makeQueryId(): string {
    return UUIDv4();
  }

}
