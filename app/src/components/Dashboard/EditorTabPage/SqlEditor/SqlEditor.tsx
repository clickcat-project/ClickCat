import React from 'react';
import { observer } from 'mobx-react';
import { Flex, FlexProps } from 'reflexy';
import classNames from 'classnames';
import { Omit } from 'typelevel-ts';
import { Query, ServerStructure } from 'services';
import { TextInsertType } from './types';
import Toolbar, { ActionType, ToolbarProps } from './Toolbar';
import css from './SqlEditor.css';
import SimpleEditor, { SimpleEditorProps } from './SimpleEditor';
// ------------------------------------------------------------------------------------
export interface SqlEditorProps
  extends Omit<ToolbarProps, 'databases'>,
    SimpleEditorProps,
    FlexProps {
      currentDatabase: string;
    }
// ------------------------------------------------------------------------------------
@observer
export default class SqlEditor extends React.Component<SqlEditorProps & {
    rows: string
  }> {
  state = {
    loaded: false
  }
  private ref: SimpleEditor | null = null;
  constructor(props: any) {
    super(props);
  }

  public insertColumn(coll: ServerStructure.Column) {
    this.insertText(` ${coll.name} `, TextInsertType.Column);
  }

  /**
   * Вставка текста к курсору
   * @param textToInsert
   * @param mode
   */
  public insertText(textToInsert: string, mode: TextInsertType) {
    this.ref?.insert(textToInsert, mode);
  }

  /**
   * Выполнение запросов, если получена command
   *
   * @param queryList
   * @param isExecAll
   */
  public execQueries = (query: Query, isExecAll: boolean): void => {
    const { onAction } = this.props;
    onAction(isExecAll ? ActionType.RunAll : ActionType.RunCurrent, query);
  };

  private onAction = (action: ActionType, eventData?: any, rows?: string): void => {
    const { onAction } = this.props;
    switch (action) {
      case ActionType.RunCurrent: {
        this.ref?.onExecCommand(false, rows || '200');
        break;
      }
      case ActionType.RunAll: {
        this.ref?.onExecCommand(true, rows || '200');
        break;
      }
      default:
        onAction(action, eventData);
        break;
    }
  };

  private onEditorMount = () => {
    // Bind key here
    // this.ref?.helper().bindKeys();
    // console.warn('onEditorMount - onEditorMount');
  };
  private setEditorRef = (editor: SimpleEditor | null) => {
    this.ref = editor;
  };

  setLoaded (vla: boolean) {
    this.setState({
      loaded: vla
    })
  }

  render() {
    const {
      serverStructure,
      currentDatabase,
      onDatabaseChange,
      onContentChange,
      content,
      stats,
      onAction,
      className,
      rows,
      ...rest
    } = this.props;

    const { loaded } = this.state

    return (
      <Flex column style={{
        paddingTop: '20px', position: 'relative', background: '#fff', paddingLeft: '36px'
      }} className={classNames(css.root, className)} {...rest}>
        <Flex grow fill className={css.editor}>
          <SimpleEditor
            ref={this.setEditorRef}
            content={content}
            readonly={false}
            processSql={true}
            onContentChange={onContentChange}
            serverStructure={serverStructure}
            onMount={this.onEditorMount}
            onExecCommand={this.execQueries}
          />
        </Flex>

        <Toolbar
          className={css.toolbar}
          databases={serverStructure ? serverStructure.databases : []}
          currentDatabase={currentDatabase}
          onDatabaseChange={onDatabaseChange}
          onAction={this.onAction}
          loaded={loaded}
          rows={rows}
          stats={stats}
        />
      </Flex>
    );
  }
}
